from sqlalchemy import Column, String, Boolean, Integer, Numeric, DateTime, ForeignKey, Text, JSON
from datetime import datetime
from backend.app.database import Base

class Shipment(Base):
    __tablename__ = "shipments"

    shipment_id = Column(String(50), primary_key=True, index=True)
    order_id = Column(String(50), ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False, index=True)
    carrier = Column(String(50), nullable=False, index=True)
    tracking_number = Column(String(100), nullable=False)
    origin_hub = Column(String(50), nullable=False)
    destination_region = Column(String(50), nullable=False)
    destination_pincode = Column(String(10), nullable=False)
    is_cod = Column(Boolean, default=False)
    cod_amount = Column(Numeric(10, 2), default=0.00)
    status = Column(String(30), default="IN_TRANSIT", index=True)
    delivery_attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class LogisticsEvent(Base):
    __tablename__ = "logistics_events"

    event_id = Column(String(50), primary_key=True, index=True)
    shipment_id = Column(String(50), ForeignKey("shipments.shipment_id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)
    status = Column(String(30), nullable=False)
    location = Column(String(100), nullable=True)
    delay_hours = Column(Numeric(6, 2), default=0.0)
    anomaly_flag = Column(Boolean, default=False, index=True)
    anomaly_type = Column(String(50), nullable=True)
    risk_classification = Column(String(30), default="UNKNOWN")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RTORiskScore(Base):
    __tablename__ = "rto_risk_scores"

    risk_id = Column(String(50), primary_key=True, index=True)
    shipment_id = Column(String(50), ForeignKey("shipments.shipment_id", ondelete="CASCADE"), nullable=False, index=True)
    rto_probability = Column(Numeric(5, 4), nullable=False)
    risk_level = Column(String(20), nullable=False, index=True)
    top_reasons = Column(JSON, nullable=True)
    expected_loss = Column(Numeric(10, 2), nullable=False)
    recommended_action = Column(String(50), nullable=False)
    action_status = Column(String(20), default="PENDING")
    created_at = Column(DateTime, default=datetime.utcnow)
