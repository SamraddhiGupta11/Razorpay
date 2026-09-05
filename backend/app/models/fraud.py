from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, JSON
from datetime import datetime
from backend.app.database import Base

class FraudEvent(Base):
    __tablename__ = "fraud_events"

    fraud_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id", ondelete="SET NULL"), nullable=True)
    fraud_score = Column(Numeric(5, 2), nullable=False)
    risk_level = Column(String(30), nullable=False, index=True)
    signals = Column(JSON, nullable=True)
    recommended_action = Column(String(50), nullable=False)
    status = Column(String(20), default="OPEN")
    created_at = Column(DateTime, default=datetime.utcnow)
