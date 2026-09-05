from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from datetime import datetime
from backend.app.database import Base

class CustomerSuggestion(Base):
    __tablename__ = "customer_suggestions"

    suggestion_id = Column(String(50), primary_key=True, index=True)
    review_id = Column(String(50), ForeignKey("reviews.review_id", ondelete="SET NULL"), nullable=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False, index=True)
    aspect = Column(String(30), nullable=False)
    suggestion_text = Column(Text, nullable=False)
    business_impact = Column(String(20), default="MEDIUM")
    priority = Column(String(20), default="MEDIUM", index=True)
    status = Column(String(20), default="OPEN")
    created_at = Column(DateTime, default=datetime.utcnow)
