from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class CheckoutSession(Base):
    __tablename__ = "checkout_sessions"

    checkout_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False, index=True)
    cart_value = Column(Float, nullable=False, index=True)
    item_count = Column(Integer, nullable=False)
    device = Column(String(20), nullable=False)
    payment_method = Column(String(30), nullable=False)
    shipping_cost = Column(Float, default=0.0)
    time_on_checkout_min = Column(Float, default=0.0)
    product_views = Column(Integer, default=1)
    coupon_views = Column(Integer, default=0)
    payment_attempts = Column(Integer, default=1)
    payment_failed = Column(Boolean, default=False)
    technical_errors = Column(Integer, default=0)
    session_count = Column(Integer, default=1)
    hour_of_day = Column(Integer, nullable=False)
    day_of_week = Column(Integer, nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow, index=True)

    customer = relationship("Customer", back_populates="checkout_sessions")
    abandoned_cart = relationship("AbandonedCart", back_populates="checkout_session", uselist=False, cascade="all, delete-orphan")
    predictions = relationship("ModelPrediction", back_populates="checkout_session", cascade="all, delete-orphan")
