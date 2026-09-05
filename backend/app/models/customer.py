from sqlalchemy import Column, String, Boolean, Integer, Numeric, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    location = Column(String(100), nullable=True)
    customer_segment = Column(String(20), nullable=False, index=True)
    is_returning = Column(Boolean, default=False)
    previous_orders = Column(Integer, default=0)
    previous_abandonments = Column(Integer, default=0)
    lifetime_orders = Column(Integer, default=0)
    lifetime_value = Column(Numeric(12, 2), default=0.00)
    average_order_value = Column(Numeric(10, 2), default=0.00)
    return_rate = Column(Numeric(5, 4), default=0.00)
    cancellation_rate = Column(Numeric(5, 4), default=0.00)
    preferred_payment_method = Column(String(30), default='UPI')
    preferred_channel = Column(String(20), default='WHATSAPP')
    created_at = Column(DateTime, default=datetime.utcnow)

    checkout_sessions = relationship("CheckoutSession", back_populates="customer", cascade="all, delete-orphan")
    conversions = relationship("Conversion", back_populates="customer", cascade="all, delete-orphan")
