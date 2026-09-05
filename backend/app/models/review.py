from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, Text, JSON
from datetime import datetime
from backend.app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(50), ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id", ondelete="SET NULL"), nullable=True)
    review_text = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False, index=True)
    language = Column(String(20), default="English")
    created_at = Column(DateTime, default=datetime.utcnow)

class ReviewAnalysis(Base):
    __tablename__ = "review_analysis"

    analysis_id = Column(String(50), primary_key=True, index=True)
    review_id = Column(String(50), ForeignKey("reviews.review_id", ondelete="CASCADE"), nullable=False, index=True)
    sentiment = Column(String(20), nullable=False, index=True)
    sentiment_score = Column(Numeric(5, 4), nullable=False)
    confidence = Column(Numeric(5, 4), nullable=False)
    topics = Column(JSON, nullable=True)
    language_detected = Column(String(30), default="English")
    created_at = Column(DateTime, default=datetime.utcnow)

class ReviewAspect(Base):
    __tablename__ = "review_aspects"

    aspect_id = Column(String(50), primary_key=True, index=True)
    review_id = Column(String(50), ForeignKey("reviews.review_id", ondelete="CASCADE"), nullable=False, index=True)
    aspect = Column(String(30), nullable=False, index=True)
    sentiment = Column(String(20), nullable=False, index=True)
    confidence = Column(Numeric(5, 4), nullable=False)
    evidence = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
