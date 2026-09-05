from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CheckoutSessionResponse(BaseModel):
    checkout_id: str
    customer_id: str
    cart_value: float
    item_count: int
    device: str
    payment_method: str
    shipping_cost: float
    time_on_checkout_min: float
    product_views: int
    coupon_views: int
    payment_attempts: int
    payment_failed: bool
    technical_errors: int
    hour_of_day: int
    day_of_week: int
    started_at: datetime

    class Config:
        from_attributes = True

class AbandonedCartItem(BaseModel):
    abandoned_cart_id: str
    checkout_id: str
    customer_id: str
    customer_segment: str
    cart_value: float
    abandonment_reason: str
    abandonment_probability: float
    recovery_probability: float
    priority_score: float
    status: str
    detected_at: datetime
    device: str
    payment_method: str

    class Config:
        from_attributes = True
