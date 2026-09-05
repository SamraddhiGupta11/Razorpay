from sqlalchemy import Column, String, Boolean, Numeric, DateTime
from datetime import datetime
from backend.app.database import Base

class Product(Base):
    __tablename__ = "products"

    product_id = Column(String(50), primary_key=True, index=True)
    product_name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    price = Column(Numeric(10, 2), nullable=False)
    margin = Column(Numeric(5, 4), default=0.35)
    weight_kg = Column(Numeric(6, 3), default=0.500)
    return_rate = Column(Numeric(5, 4), default=0.05)
    size_sensitive = Column(Boolean, default=False, index=True)
    fragile = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
