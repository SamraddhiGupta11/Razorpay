from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class CustomerBase(BaseModel):
    customer_id: str
    customer_segment: str
    is_returning: bool
    previous_orders: int
    previous_abandonments: int

class CustomerResponse(CustomerBase):
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CustomerDetailResponse(CustomerResponse):
    total_sessions: int
    total_spent: float
    total_abandoned: int
    last_checkout_date: Optional[datetime] = None
