from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Intervention(Base):
    __tablename__ = "interventions"

    intervention_id = Column(String(50), primary_key=True, index=True)
    abandoned_cart_id = Column(String(50), ForeignKey("abandoned_carts.abandoned_cart_id", ondelete="CASCADE"), nullable=False, index=True)
    channel = Column(String(20), nullable=False, index=True)
    action = Column(String(30), nullable=False, index=True)
    scheduled_at = Column(DateTime)
    sent_at = Column(DateTime, index=True)
    intervention_cost = Column(Float, default=0.0)
    discount_cost = Column(Float, default=0.0)
    status = Column(String(20), default="PENDING", index=True)

    abandoned_cart = relationship("AbandonedCart", back_populates="interventions")
    conversions = relationship("Conversion", back_populates="intervention", cascade="all, delete-orphan")
