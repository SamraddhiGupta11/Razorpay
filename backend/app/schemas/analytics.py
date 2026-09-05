from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class DashboardSummaryResponse(BaseModel):
    total_checkouts: int
    abandoned_checkouts: int
    abandonment_rate_pct: float
    revenue_at_risk: float
    revenue_recovered: float
    net_recovered_profit: float
    recovery_rate_pct: float
    total_intervention_cost: float
    overall_roi_pct: float

class ReasonBreakdown(BaseModel):
    reason: str
    count: int
    percentage: float
    revenue_at_risk: float
    recovered_revenue: float
    recovery_rate_pct: float

class SegmentPerformance(BaseModel):
    segment: str
    total_customers: int
    abandoned_count: int
    recovered_count: int
    recovery_rate_pct: float
    recovered_revenue: float

class ChannelPerformance(BaseModel):
    channel: str
    interventions_sent: int
    conversions: int
    conversion_rate_pct: float
    revenue_generated: float
    total_cost: float
    net_profit: float
    roi_pct: float

class FunnelStep(BaseModel):
    step: str
    count: int
    percentage: float

class ChartsResponse(BaseModel):
    reasons: List[ReasonBreakdown]
    segments: List[SegmentPerformance]
    channels: List[ChannelPerformance]
    funnel: List[FunnelStep]
    trend: List[Dict[str, Any]]

class SimulatorRequest(BaseModel):
    checkout_volume: int = Field(100000, ge=1000, le=1000000)
    avg_cart_value: float = Field(2500.0, ge=100.0)
    abandonment_rate_pct: float = Field(34.0, ge=5.0, le=90.0)
    recovery_rate_pct: float = Field(35.0, ge=1.0, le=90.0)
    avg_discount_pct: float = Field(5.0, ge=0.0, le=50.0)
    cost_per_intervention: float = Field(1.20, ge=0.05, le=50.0)
    gross_margin_pct: float = Field(35.0, ge=5.0, le=90.0)

class SimulatorResponse(BaseModel):
    revenue_at_risk: float
    abandoned_checkouts: int
    expected_recovered_customers: int
    gross_recovered_revenue: float
    discount_cost: float
    intervention_cost: float
    total_recovery_cost: float
    net_recovered_profit: float
    roi_pct: float
    revenue_lift_crores: float
