from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Conversion(Base):
    __tablename__ = "conversions"

    conversion_id = Column(String(50), primary_key=True, index=True)
    intervention_id = Column(String(50), ForeignKey("interventions.intervention_id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False, index=True)
    order_value = Column(Float, nullable=False)
    recovered_profit = Column(Float, nullable=False)
    converted_at = Column(DateTime, default=datetime.utcnow, index=True)

    intervention = relationship("Intervention", back_populates="conversions")
    customer = relationship("Customer", back_populates="conversions")
