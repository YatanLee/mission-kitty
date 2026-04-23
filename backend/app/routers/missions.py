from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from app.models.mission import MissionCreate, MissionUpdate
from app.database import supabase
from app.services.cat_service import calculate_cat_state

router = APIRouter(prefix="/missions", tags=["missions"])


def get_user_id(authorization: Optional[str]) -> str:
    """Extract user_id from Supabase JWT token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization token")
    token = authorization.split(" ")[1]
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user.user.id


@router.get("")
async def list_missions(authorization: Optional[str] = Header(None)):
    user_id = get_user_id(authorization)
    result = (
        supabase.table("missions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return {"missions": result.data}


@router.get("/cat-state")
async def get_cat_state(authorization: Optional[str] = Header(None)):
    user_id = get_user_id(authorization)
    result = (
        supabase.table("missions")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    state = calculate_cat_state(result.data)
    return state


@router.post("")
async def create_mission(
    mission: MissionCreate, authorization: Optional[str] = Header(None)
):
    user_id = get_user_id(authorization)
    payload = {
        **mission.model_dump(exclude_none=True),
        "user_id": user_id,
        "is_done_today": False,
        "streak": 0,
    }
    if payload.get("due_date"):
        payload["due_date"] = str(payload["due_date"])
    result = supabase.table("missions").insert(payload).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create mission")
    return result.data[0]


@router.patch("/{mission_id}")
async def update_mission(
    mission_id: str,
    update: MissionUpdate,
    authorization: Optional[str] = Header(None),
):
    user_id = get_user_id(authorization)
    payload = update.model_dump(exclude_none=True)
    if not payload:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Handle streak increment when completing a mission
    if payload.get("is_done_today") is True:
        current = (
            supabase.table("missions")
            .select("streak, is_done_today")
            .eq("id", mission_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        if current.data and not current.data.get("is_done_today"):
            payload["streak"] = current.data.get("streak", 0) + 1

    if payload.get("due_date"):
        payload["due_date"] = str(payload["due_date"])

    result = (
        supabase.table("missions")
        .update(payload)
        .eq("id", mission_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Mission not found")
    return result.data[0]


@router.delete("/{mission_id}")
async def delete_mission(
    mission_id: str, authorization: Optional[str] = Header(None)
):
    user_id = get_user_id(authorization)
    supabase.table("missions").delete().eq("id", mission_id).eq(
        "user_id", user_id
    ).execute()
    return {"ok": True}
