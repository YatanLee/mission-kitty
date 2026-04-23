import json
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.groq_api_key)

CAT_SYSTEM_PROMPT = """You are Kitty, a sassy and adorable black cat who is also a productivity assistant.
You speak in short, cute sentences. You occasionally add cat sounds like "meow", "purr", or "nyaa~".
You are encouraging but playful — you tease the user if they are lazy.

When asked to create a mission, extract the details and respond with valid JSON only (no markdown):
{
  "type": "create_mission",
  "title": "...",
  "description": "...",
  "category": "health|work|personal|custom",
  "frequency": "daily|weekly",
  "message": "Kitty's cute response message here"
}

For daily check-ins or general chat, respond with:
{
  "type": "chat",
  "message": "Kitty's response here"
}

Categories:
- health: exercise, water, sleep, diet
- work: tasks, study, coding, meetings
- personal: reading, meditation, journaling, hobbies
- custom: anything else
"""


def chat_with_kitty(user_message: str, missions_context: list = None) -> dict:
    """Send a message to Kitty and get a structured response."""

    context = ""
    if missions_context:
        pending = [m for m in missions_context if not m.get("is_done_today")]
        done = [m for m in missions_context if m.get("is_done_today")]
        context = (
            f"\nToday's missions: {len(done)} done, {len(pending)} pending. "
            f"Pending: {[m['title'] for m in pending[:3]]}"
        )

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": CAT_SYSTEM_PROMPT + context},
            {"role": "user", "content": user_message},
        ],
        max_tokens=300,
        temperature=0.8,
    )

    raw = response.choices[0].message.content.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"type": "chat", "message": raw}
