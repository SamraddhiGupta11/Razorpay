from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey
from datetime import datetime
from backend.app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(String(50), primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=True, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    payment_method = Column(String(30), nullable=False)
    gateway = Column(String(30), default="Razorpay")
    status = Column(String(20), default="SUCCESS", index=True)
    error_code = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
