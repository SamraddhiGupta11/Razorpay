from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db

router = APIRouter(prefix="/analytics", tags=["Business Intelligence & Analytics"])

@router.get("/trends")
def get_analytics_trends(db: Session = Depends(get_db)):
    """
    Deep-dive business intelligence across:
    - Product Categories (return rates, order volumes, margin)
    - Regional Corridor Performance (North, South, East, West, Central)
    - Top Risk Products (products driving highest return & RTO losses)
    - Customer Segment Value Matrix
    """
    # 1. Category Intelligence
    sql_cat = text("""
        SELECT 
            p.category,
            COUNT(o.order_id) as total_orders,
            COALESCE(SUM(o.order_value), 0) as total_revenue,
            SUM(CASE WHEN o.order_status = 'RETURNED' THEN 1 ELSE 0 END) as returns_count,
            ROUND(AVG(p.margin) * 100, 1) as avg_margin_pct
        FROM products p
        LEFT JOIN orders o ON p.product_id = o.product_id
        GROUP BY p.category
        ORDER BY total_revenue DESC;
    """)
    categories = [
        {
            "category": r.category,
            "total_orders": int(r.total_orders),
            "total_revenue": float(r.total_revenue),
            "returns_count": int(r.returns_count),
            "return_rate_pct": round((int(r.returns_count) / max(int(r.total_orders), 1)) * 100.0, 1),
            "avg_margin_pct": float(r.avg_margin_pct)
        }
        for r in db.execute(sql_cat).fetchall()
    ]

    # 2. Regional Delivery & RTO Corridors
    sql_regions = text("""
        SELECT 
            destination_region,
            COUNT(*) as total_shipments,
            SUM(CASE WHEN is_cod = TRUE THEN 1 ELSE 0 END) as cod_count,
            SUM(CASE WHEN status = 'RETURNED_TO_ORIGIN' THEN 1 ELSE 0 END) as rto_count,
            COALESCE(SUM(cod_amount), 0) as cod_volume
        FROM shipments
        GROUP BY destination_region;
    """)
    regions = [
        {
            "region": r.destination_region,
            "total_shipments": int(r.total_shipments),
            "cod_count": int(r.cod_count),
            "cod_pct": round((int(r.cod_count) / max(int(r.total_shipments), 1)) * 100.0, 1),
            "rto_count": int(r.rto_count),
            "rto_rate_pct": round((int(r.rto_count) / max(int(r.total_shipments), 1)) * 100.0, 1),
            "cod_volume": float(r.cod_volume)
        }
        for r in db.execute(sql_regions).fetchall()
    ]

    # 3. Product Level Risk Intelligence (Top 10 Risk Items)
    sql_top_risk_prods = text("""
        SELECT 
            p.product_id,
            p.product_name,
            p.category,
            p.price,
            p.size_sensitive,
            COUNT(o.order_id) as orders_count,
            SUM(CASE WHEN o.order_status = 'RETURNED' THEN 1 ELSE 0 END) as return_count,
            COALESCE(SUM(rrs.expected_loss), 0) as total_return_loss_at_risk
        FROM products p
        JOIN orders o ON p.product_id = o.product_id
        LEFT JOIN return_risk_scores rrs ON o.order_id = rrs.order_id
        GROUP BY p.product_id, p.product_name, p.category, p.price, p.size_sensitive
        ORDER BY total_return_loss_at_risk DESC
        LIMIT 8;
    """)
    top_products = [
        {
            "product_id": r.product_id,
            "product_name": r.product_name,
            "category": r.category,
            "price": float(r.price),
            "size_sensitive": bool(r.size_sensitive),
            "orders_count": int(r.orders_count),
            "return_count": int(r.return_count),
            "return_rate_pct": round((int(r.return_count) / max(int(r.orders_count), 1)) * 100.0, 1),
            "loss_at_risk": float(r.total_return_loss_at_risk)
        }
        for r in db.execute(sql_top_risk_prods).fetchall()
    ]

    return {
        "success": True,
        "categories": categories,
        "regions": regions,
        "top_risk_products": top_products
    }

@router.get("/category-risk")
def get_category_risk(db: Session = Depends(get_db)):
    """Returns category-level return rates and size sensitivity for cross-pillar analytics."""
    sql = text("""
        SELECT 
            p.category,
            COUNT(o.order_id) as total_orders,
            SUM(CASE WHEN o.order_status = 'RETURNED' THEN 1 ELSE 0 END) as returns_count,
            ROUND(AVG(CASE WHEN p.size_sensitive THEN 1.0 ELSE 0.0 END) * 100, 1) as size_sensitive_pct
        FROM products p
        LEFT JOIN orders o ON p.product_id = o.product_id
        GROUP BY p.category
        ORDER BY total_orders DESC;
    """)
    categories = [
        {
            "category": r.category,
            "total_orders": int(r.total_orders),
            "return_rate_pct": round((int(r.returns_count) / max(int(r.total_orders), 1)) * 100.0, 1),
            "size_sensitive_pct": float(r.size_sensitive_pct or 0.0)
        }
        for r in db.execute(sql).fetchall()
    ]
    return {
        "success": True,
        "categories": categories
    }
