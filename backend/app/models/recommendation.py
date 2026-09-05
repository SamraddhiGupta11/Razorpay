from sqlalchemy import Column, String, Numeric, DateTime, Text
from datetime import datetime
from backend.app.database import Base

class SellerRecommendation(Base):
    __tablename__ = "seller_recommendations"

    recommendation_id = Column(String(50), primary_key=True, index=True)
    issue = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)
    frequency_pct = Column(Numeric(5, 2), nullable=False)
    sentiment_score = Column(Numeric(5, 4), nullable=False)
    business_impact = Column(String(20), nullable=False)
    estimated_monthly_impact = Column(Numeric(12, 2), nullable=False)
    recommendation_text = Column(Text, nullable=False)
    priority = Column(String(20), nullable=False, index=True)
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)
