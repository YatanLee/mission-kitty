from pydantic import BaseModel
from typing import Optional
from datetime import date
from enum import Enum


class Category(str, Enum):
    health = "health"
    work = "work"
    personal = "personal"
    custom = "custom"


class Frequency(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    custom = "custom"


class MissionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Category = Category.custom
    frequency: Frequency = Frequency.daily
    interval_days: Optional[int] = None   # for frequency=custom, e.g. every 3 days
    due_date: Optional[date] = None


class MissionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[Category] = None
    frequency: Optional[Frequency] = None
    interval_days: Optional[int] = None
    is_done_today: Optional[bool] = None
    due_date: Optional[date] = None
    last_completed_date: Optional[date] = None


class Mission(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    category: Category
    frequency: Frequency
    interval_days: Optional[int] = None
    is_done_today: bool = False
    streak: int = 0
    due_date: Optional[date] = None
    last_completed_date: Optional[date] = None
    created_at: str
