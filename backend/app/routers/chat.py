from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from app.database import supabase
from app.services.groq_service import chat_with_kitty
from app.routers.missions import get_user_id

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str


@router.post("")
async def chat(
    body: ChatRequest, authorization: Optional[str] = Header(None)
):
    user_id = get_user_id(authorization)

    # Fetch today's missions for context
    missions_result = (
        supabase.table("missions")
        .select("title, is_done_today, frequency")
        .eq("user_id", user_id)
        .execute()
    )
    missions = missions_result.data or []

    response = chat_with_kitty(body.message, missions)

    # If Kitty wants to create a mission, persist it
    if response.get("type") == "create_mission":
        from app.models.mission import MissionCreate, Category, Frequency
        try:
            mission_data = MissionCreate(
                title=response["title"],
                description=response.get("description"),
                category=Category(response.get("category", "custom")),
                frequency=Frequency(response.get("frequency", "daily")),
            )
            payload = {
                **mission_data.model_dump(exclude_none=True),
                "user_id": user_id,
                "is_done_today": False,
                "streak": 0,
            }
            supabase.table("missions").insert(payload).execute()
            response["mission_created"] = True
        except Exception:
            response["mission_created"] = False

    return response
