from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class PredictAbandonmentRequest(BaseModel):
    cart_value: float = Field(..., example=2500.0)
    shipping_cost: float = Field(0.0, example=99.0)
    customer_segment: str = Field("Regular", example="Regular")
    is_returning: bool = Field(True, example=True)
    previous_orders: int = Field(2, example=3)
    previous_abandonments: int = Field(0, example=1)
    session_count: int = Field(2, example=4)
    item_count: int = Field(1, example=2)
    device: str = Field("Mobile", example="Mobile")
    payment_method: str = Field("UPI", example="UPI")
    time_on_checkout_min: float = Field(3.5, example=4.0)
    product_views: int = Field(3, example=5)
    coupon_views: int = Field(0, example=2)
    payment_attempts: int = Field(1, example=1)
    payment_failed: bool = Field(False, example=False)
    technical_errors: int = Field(0, example=0)
    hour_of_day: int = Field(14, example=18)
    day_of_week: int = Field(2, example=4)

class PredictRecoveryRequest(BaseModel):
    cart_value: float = Field(..., example=35000.0)
    shipping_cost: float = Field(0.0, example=150.0)
    customer_segment: str = Field("VIP", example="VIP")
    is_returning: bool = Field(True, example=True)
    previous_orders: int = Field(5, example=8)
    previous_abandonments: int = Field(1, example=1)
    session_count: int = Field(5, example=6)
    device: str = Field("Mobile", example="Mobile")
    payment_method: str = Field("Credit Card", example="UPI")
    time_on_checkout_min: float = Field(4.0, example=5.2)
    product_views: int = Field(4, example=6)
    coupon_views: int = Field(1, example=1)
    payment_attempts: int = Field(1, example=2)
    payment_failed: bool = Field(False, example=True)
    technical_errors: int = Field(0, example=0)
    hour_of_day: int = Field(18, example=19)
    day_of_week: int = Field(4, example=5)

class RecommendActionRequest(PredictAbandonmentRequest):
    pass

class ActionComparisonOption(BaseModel):
    action: str
    channel: str
    timing: str
    expected_conversion_probability: float
    expected_conversion_pct: str
    expected_revenue: float
    discount_cost: float
    channel_cost: float
    total_expected_cost: float
    expected_profit: float
    roi_pct: float

class DecisionResponse(BaseModel):
    recommended_action: str
    channel: str
    timing: str
    expected_conversion_pct: str
    expected_revenue: float
    expected_cost: float
    expected_profit: float
    roi_pct: float
    economic_rationale: str
    action_comparison_matrix: List[ActionComparisonOption]

class FullRecoveryIntelligenceResponse(BaseModel):
    abandonment_risk: Dict[str, Any]
    reason_diagnosis: Dict[str, Any]
    recovery_prediction: Dict[str, Any]
    explainable_ai: Dict[str, Any]
    decision: DecisionResponse
