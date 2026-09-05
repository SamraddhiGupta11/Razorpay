from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Dict, Any, List
from backend.app.database import get_db
from backend.app.ml.service import ml_service

router = APIRouter(prefix="/returns", tags=["Return Risk Engine"])

@router.get("/overview")
def get_returns_overview(db: Session = Depends(get_db)):
    """Summary of return rates, losses, and risk distribution."""
    sql = text("""
        SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN order_status = 'RETURNED' THEN 1 ELSE 0 END) as returned_orders,
            COALESCE(SUM(CASE WHEN order_status = 'RETURNED' THEN order_value ELSE 0 END), 0) as total_refund_amount
        FROM orders;
    """)
    row = db.execute(sql).fetchone()

    total_ord = int(row.total_orders) if row else 15000
    ret_ord = int(row.returned_orders) if row else 1757
    refund_amt = float(row.total_refund_amount) if row else 4200000.0

    # Risk level distribution
    sql_dist = text("SELECT risk_level, COUNT(*) as count FROM return_risk_scores GROUP BY risk_level;")
    dist = {r.risk_level: int(r.count) for r in db.execute(sql_dist).fetchall()}

    # Top return reasons
    sql_reasons = text("""
        SELECT reason, COUNT(*) as count 
        FROM returns 
        GROUP BY reason 
        ORDER BY count DESC;
    """)
    reasons = [{"reason": r.reason, "count": int(r.count)} for r in db.execute(sql_reasons).fetchall()]

    return {
        "success": True,
        "total_orders": total_ord,
        "returned_orders": ret_ord,
        "return_rate_pct": round((ret_ord / max(total_ord, 1)) * 100.0, 2),
        "total_refunded_value": refund_amt,
        "risk_distribution": dist,
        "top_return_reasons": reasons
    }

@router.get("/orders")
def get_return_risk_orders(
    limit: int = Query(20, ge=1, le=100),
    risk_level: str = Query(None),
    db: Session = Depends(get_db)
):
    """Queue of active orders with return risk predictions and recommended actions."""
    filter_clause = "WHERE rrs.risk_level = :risk" if risk_level else ""
    sql = text(f"""
        SELECT 
            o.order_id,
            o.customer_id,
            c.name as customer_name,
            c.customer_segment,
            p.product_name,
            p.category,
            p.size_sensitive,
            o.order_value,
            o.payment_method,
            o.shipping_address_region,
            rrs.return_probability,
            rrs.risk_level,
            rrs.expected_loss,
            rrs.recommended_action,
            rrs.action_status
        FROM return_risk_scores rrs
        JOIN orders o ON rrs.order_id = o.order_id
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON o.product_id = p.product_id
        {filter_clause}
        ORDER BY rrs.return_probability DESC
        LIMIT :limit;
    """)
    params = {"limit": limit}
    if risk_level:
        params["risk"] = risk_level.upper()

    rows = db.execute(sql, params).fetchall()
    orders = [
        {
            "order_id": r.order_id,
            "customer_id": r.customer_id,
            "customer_name": r.customer_name,
            "customer_segment": r.customer_segment,
            "product_name": r.product_name,
            "category": r.category,
            "size_sensitive": bool(r.size_sensitive),
            "order_value": float(r.order_value),
            "payment_method": r.payment_method,
            "region": r.shipping_address_region,
            "return_probability": float(r.return_probability),
            "risk_level": r.risk_level,
            "expected_loss": float(r.expected_loss),
            "recommended_action": r.recommended_action,
            "action_status": r.action_status
        }
        for r in rows
    ]
    return orders

@router.post("/predict")
def predict_order_return_risk(payload: Dict[str, Any]):
    """Runs Model 3 to predict return risk and generate XAI with Next Best Action."""
    return ml_service.predict_return_risk(payload)
