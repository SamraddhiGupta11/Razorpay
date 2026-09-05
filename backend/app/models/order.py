from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey
from datetime import datetime
from backend.app.database import Base

class Order(Base):
    __tablename__ = "orders"

    order_id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(50), ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False, index=True)
    order_value = Column(Numeric(12, 2), nullable=False)
    discount_percentage = Column(Numeric(5, 2), default=0.0)
    payment_method = Column(String(30), nullable=False)
    payment_status = Column(String(20), default="COMPLETED")
    order_status = Column(String(20), default="DELIVERED", index=True)
    shipping_address_region = Column(String(50), nullable=False)
    shipping_pincode = Column(String(10), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
