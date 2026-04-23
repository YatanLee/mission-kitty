from pydantic import BaseModel, Field
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
    interval_days: Optional[int] = None        # for frequency=custom
    target_count: int = Field(default=1, ge=1, le=99)  # times per day/period
    due_date: Optional[date] = None


class MissionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[Category] = None
    frequency: Optional[Frequency] = None
    interval_days: Optional[int] = None
    target_count: Optional[int] = Field(default=None, ge=1, le=99)
    completed_count: Optional[int] = Field(default=None, ge=0)
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
    target_count: int = 1
    completed_count: int = 0
    is_done_today: bool = False
    streak: int = 0
    due_date: Optional[date] = None
    last_completed_date: Optional[date] = None
    created_at: str
