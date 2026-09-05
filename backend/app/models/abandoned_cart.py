from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class AbandonedCart(Base):
    __tablename__ = "abandoned_carts"

    abandoned_cart_id = Column(String(50), primary_key=True, index=True)
    checkout_id = Column(String(50), ForeignKey("checkout_sessions.checkout_id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    abandonment_reason = Column(String(30), nullable=False, index=True)
    abandonment_probability = Column(Float, nullable=False)
    recovery_probability = Column(Float, nullable=False)
    detected_at = Column(DateTime, default=datetime.utcnow, index=True)
    status = Column(String(20), default="DETECTED", index=True)

    checkout_session = relationship("CheckoutSession", back_populates="abandoned_cart")
    interventions = relationship("Intervention", back_populates="abandoned_cart", cascade="all, delete-orphan")
