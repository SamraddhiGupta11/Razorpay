from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class ModelPrediction(Base):
    __tablename__ = "model_predictions"

    prediction_id = Column(String(50), primary_key=True, index=True)
    checkout_id = Column(String(50), ForeignKey("checkout_sessions.checkout_id", ondelete="CASCADE"), nullable=False, index=True)
    model_name = Column(String(50), nullable=False, index=True)
    prediction = Column(Float, nullable=False)
    predicted_label = Column(String(50))
    model_version = Column(String(20), default="v1.0.0")
    created_at = Column(DateTime, default=datetime.utcnow)

    checkout_session = relationship("CheckoutSession", back_populates="predictions")
