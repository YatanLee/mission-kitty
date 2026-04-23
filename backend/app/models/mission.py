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


class MissionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Category = Category.custom
    frequency: Frequency = Frequency.daily
    due_date: Optional[date] = None


class MissionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[Category] = None
    frequency: Optional[Frequency] = None
    is_done_today: Optional[bool] = None
    due_date: Optional[date] = None


class Mission(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    category: Category
    frequency: Frequency
    is_done_today: bool = False
    streak: int = 0
    due_date: Optional[date] = None
    created_at: str
