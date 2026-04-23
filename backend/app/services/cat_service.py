from typing import List
from datetime import date


def is_due_today(mission: dict) -> bool:
    """Return True if this mission is scheduled for today."""
    today = date.today()
    raw = mission.get("created_at", "")
    try:
        created = date.fromisoformat(raw[:10])
    except (ValueError, TypeError):
        created = today

    freq = mission.get("frequency", "daily")

    if freq == "daily":
        return True
    elif freq == "weekly":
        return today.weekday() == created.weekday()
    elif freq == "monthly":
        return today.day == created.day
    elif freq == "custom":
        n = mission.get("interval_days") or 1
        diff = (today - created).days
        return diff >= 0 and diff % n == 0
    return False


def calculate_cat_state(missions: List[dict]) -> dict:
    """Derive the cat's emotional state from missions due today."""
    if not missions:
        return {"happiness": 0, "state": "idle", "completion_rate": 0,
                "done": 0, "total": 0, "streak": 0}

    due = [m for m in missions if is_due_today(m)]

    if not due:
        return {"happiness": 0, "state": "idle", "completion_rate": 0,
                "done": 0, "total": 0, "streak": 0}

    total = len(due)
    # A mission is done when completed_count >= target_count (or is_done_today)
    def is_done(m):
        target = m.get("target_count") or 1
        completed = m.get("completed_count") or 0
        return m.get("is_done_today") or completed >= target

    done = sum(1 for m in due if is_done(m))
    rate = done / total if total else 0
    pct = int(rate * 100)

    if pct == 0:
        state = "sad"
    elif pct < 50:
        state = "idle"
    elif pct < 80:
        state = "content"
    elif pct < 100:
        state = "happy"
    else:
        state = "celebrating"

    max_streak = max((m.get("streak", 0) for m in due), default=0)

    return {
        "happiness": pct,
        "state": state,
        "completion_rate": rate,
        "done": done,
        "total": total,
        "streak": max_streak,
    }
