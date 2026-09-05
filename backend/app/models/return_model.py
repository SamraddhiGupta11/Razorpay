from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, JSON
from datetime import datetime
from backend.app.database import Base

class Return(Base):
    __tablename__ = "returns"

    return_id = Column(String(50), primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(50), ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False, index=True)
    reason = Column(String(50), nullable=False)
    status = Column(String(20), default="REQUESTED")
    refund_amount = Column(Numeric(12, 2), default=0.00)
    created_at = Column(DateTime, default=datetime.utcnow)

class ReturnRiskScore(Base):
    __tablename__ = "return_risk_scores"

    risk_id = Column(String(50), primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False, index=True)
    return_probability = Column(Numeric(5, 4), nullable=False)
    risk_level = Column(String(20), nullable=False, index=True)
    top_reasons = Column(JSON, nullable=True)
    expected_loss = Column(Numeric(10, 2), nullable=False)
    recommended_action = Column(String(50), nullable=False)
    action_status = Column(String(20), default="RECOMMENDED")
    created_at = Column(DateTime, default=datetime.utcnow)
