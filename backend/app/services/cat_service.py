from typing import List


def calculate_cat_state(missions: List[dict]) -> dict:
    """Derive the cat's emotional state from today's missions."""
    if not missions:
        return {"happiness": 0, "state": "idle", "completion_rate": 0}

    daily = [m for m in missions if m.get("frequency") == "daily"]
    if not daily:
        daily = missions

    total = len(daily)
    done = sum(1 for m in daily if m.get("is_done_today"))
    rate = done / total if total > 0 else 0
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

    max_streak = max((m.get("streak", 0) for m in daily), default=0)

    return {
        "happiness": pct,
        "state": state,
        "completion_rate": rate,
        "done": done,
        "total": total,
        "streak": max_streak,
    }
