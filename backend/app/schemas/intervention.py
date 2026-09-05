from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class InterventionExecuteRequest(BaseModel):
    action: str = Field(..., example="FREE_SHIPPING")
    channel: str = Field(..., example="WHATSAPP")
    discount_cost: float = Field(0.0, example=99.0)
    simulate_customer_delay_ms: int = Field(500, example=500)

class InterventionExecuteResponse(BaseModel):
    intervention_id: str
    abandoned_cart_id: str
    status: str
    action: str
    channel: str
    sent_at: datetime
    customer_response: str
    converted: bool
    order_value: float
    recovered_profit: float
    message: str
