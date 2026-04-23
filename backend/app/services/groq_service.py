import json
import re
from datetime import date, timedelta
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.groq_api_key)

# Today injected at call time so the model knows the real date
def _build_system_prompt(today: date) -> str:
    return f"""You are 饅頭 (Mantou), a sassy adorable black cat productivity assistant.
You support BOTH English and Traditional Chinese (繁體中文). Always reply in the same language the user used.
Today's date is {today.isoformat()} (YYYY-MM-DD).

━━━ MISSION DETECTION ━━━
If the user describes any task, habit, reminder, or recurring activity → create a mission.
Respond with ONLY raw JSON (absolutely no markdown fences, no explanation outside JSON):

{{
  "type": "create_mission",
  "title": "short mission title",
  "description": "optional extra detail or null",
  "category": "health|work|personal|custom",
  "frequency": "daily|weekly|monthly|custom",
  "interval_days": null,
  "target_count": 1,
  "due_date": null,
  "message": "Kitty's cute in-character reply in the user's language"
}}

━━━ PARSING RULES (follow strictly) ━━━

FREQUENCY:
  每天 / daily / 天天          → frequency="daily"
  每週 / 每周 / 每星期 / weekly → frequency="weekly"
  每月 / 每個月 / monthly       → frequency="monthly"
  每N天 / every N days         → frequency="custom", interval_days=N
  每兩天                       → frequency="custom", interval_days=2
  每三天                       → frequency="custom", interval_days=3
  每四天                       → frequency="custom", interval_days=4
  每五天                       → frequency="custom", interval_days=5
  每七天                       → frequency="custom", interval_days=7
  隔一天 / every other day     → frequency="custom", interval_days=2

CHINESE NUMBERS (convert to integer):
  一=1 二=2 三=3 四=4 五=5 六=6 七=7 八=8 九=9 十=10
  十一=11 十二=12 十五=15 二十=20 三十=30
  半 → round up to 1

TIMES PER PERIOD (target_count):
  "8次" / "8 times" / "八次" → target_count=8
  "3杯" / "3 glasses"       → target_count=3
  Default: 1

DUE DATE (start date):
  "25號" / "25日" → due_date="{today.year}-{today.month:02d}-25"
    (if that day has already passed this month, use next month)
  "下週一"         → next Monday from today
  No date mentioned → due_date=null

CATEGORY GUIDE:
  health   → 飲水, 運動, 睡眠, 飲食, 換水, 健康
  work     → 工作, 學習, 開會, 報告, 程式
  personal → 閱讀, 冥想, 日記, 嗜好
  custom   → everything else (pets, chores, errands)

━━━ GENERAL CHAT ━━━
For anything that is NOT a mission → respond with:
{{"type": "chat", "message": "Kitty's cute reply"}}

━━━ EXAMPLES ━━━
User: "25號開始，每三天幫饅頭換一次水"
→ {{
  "type": "create_mission",
  "title": "幫饅頭換水",
  "description": "每三天換一次水",
  "category": "custom",
  "frequency": "custom",
  "interval_days": 3,
  "target_count": 1,
  "due_date": "{today.year}-{today.month:02d}-25",
  "message": "好的喵～已經幫你設定每三天幫饅頭換水囉！🐾"
}}

User: "remind me to drink 8 glasses of water every day"
→ {{
  "type": "create_mission",
  "title": "Drink water",
  "description": "8 glasses per day",
  "category": "health",
  "frequency": "daily",
  "interval_days": null,
  "target_count": 8,
  "due_date": null,
  "message": "Staying hydrated! Nyaa~ I'll remind you to drink 8 glasses daily! 💧"
}}
"""


def _next_occurrence(day: int, today: date) -> str:
    """Return YYYY-MM-DD for the given day-of-month, this or next month."""
    try:
        target = date(today.year, today.month, day)
    except ValueError:
        target = date(today.year, today.month + 1, day) if today.month < 12 \
                 else date(today.year + 1, 1, day)
    if target < today:
        if today.month == 12:
            target = date(today.year + 1, 1, day)
        else:
            try:
                target = date(today.year, today.month + 1, day)
            except ValueError:
                target = date(today.year, today.month + 1, 28)
    return target.isoformat()


def _post_process(data: dict, today: date) -> dict:
    """Fix common model mistakes after parsing."""
    # Ensure interval_days is int when frequency=custom
    if data.get("frequency") == "custom":
        iv = data.get("interval_days")
        if not iv or not isinstance(iv, int) or iv < 1:
            data["interval_days"] = 3  # safe fallback

    # Ensure target_count is int >= 1
    tc = data.get("target_count", 1)
    try:
        data["target_count"] = max(1, int(tc))
    except (TypeError, ValueError):
        data["target_count"] = 1

    # Resolve relative due_date strings like "2026-04-25"
    due = data.get("due_date")
    if isinstance(due, str) and re.match(r"\d{4}-\d{2}-\d{2}", due):
        try:
            d = date.fromisoformat(due)
            if d < today:          # already passed → push to next occurrence
                data["due_date"] = _next_occurrence(d.day, today)
        except ValueError:
            data["due_date"] = None

    return data


def chat_with_kitty(user_message: str, missions_context: list = None) -> dict:
    today = date.today()

    context = ""
    if missions_context:
        pending = [m for m in missions_context if not m.get("is_done_today")]
        done    = [m for m in missions_context if m.get("is_done_today")]
        context = (
            f"\n\n[Context] Today {today.isoformat()}: "
            f"{len(done)} missions done, {len(pending)} pending. "
            f"Pending titles: {[m['title'] for m in pending[:4]]}"
        )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",   # smarter model for better Chinese parsing
        messages=[
            {"role": "system", "content": _build_system_prompt(today) + context},
            {"role": "user",   "content": user_message},
        ],
        max_tokens=400,
        temperature=0.4,   # lower = more reliable JSON
    )

    raw = response.choices[0].message.content.strip()

    # Strip accidental markdown fences
    raw = re.sub(r"^```[a-z]*\n?", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\n?```$", "", raw, flags=re.MULTILINE)
    raw = raw.strip()

    try:
        data = json.loads(raw)
        if data.get("type") == "create_mission":
            data = _post_process(data, today)
        return data
    except json.JSONDecodeError:
        # Try to salvage a JSON object buried in prose
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group())
                if data.get("type") == "create_mission":
                    data = _post_process(data, today)
                return data
            except json.JSONDecodeError:
                pass
        return {"type": "chat", "message": raw}
