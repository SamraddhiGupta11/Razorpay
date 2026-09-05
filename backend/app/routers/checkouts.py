from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, List
from backend.app.database import get_db
from backend.app.schemas.checkout import AbandonedCartItem

router = APIRouter(prefix="/checkouts", tags=["Checkouts"])

@router.get("/abandoned", response_model=List[AbandonedCartItem])
def get_abandoned_checkouts(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    reason: Optional[str] = Query(None, description="Filter by reason: SHIPPING, PAYMENT, PRICE, etc."),
    segment: Optional[str] = Query(None, description="Filter by segment: VIP, Regular, etc."),
    min_cart: Optional[float] = Query(None, description="Minimum cart value filter"),
    sort_by: str = Query("priority", description="Sort by: priority, cart_value, recovery_prob, date"),
    db: Session = Depends(get_db)
):
    """
    Fetches abandoned checkouts ranked by priority score or custom criteria.
    Priority Score = cart_value * recovery_probability * urgency_factor.
    """
    where_clauses = ["1=1"]
    params = {"limit": limit, "offset": offset}

    if reason:
        where_clauses.append("ac.abandonment_reason = :reason")
        params["reason"] = reason.upper()
    if segment:
        where_clauses.append("c.customer_segment = :segment")
        params["segment"] = segment
    if min_cart is not None:
        where_clauses.append("cs.cart_value >= :min_cart")
        params["min_cart"] = min_cart

    # Sorting
    if sort_by == "cart_value":
        order_clause = "cs.cart_value DESC"
    elif sort_by == "recovery_prob":
        order_clause = "ac.recovery_probability DESC"
    elif sort_by == "date":
        order_clause = "ac.detected_at DESC"
    else: # priority default
        order_clause = "(cs.cart_value * ac.recovery_probability) DESC"

    sql = text(f"""
        SELECT 
            ac.abandoned_cart_id,
            ac.checkout_id,
            c.customer_id,
            c.customer_segment,
            cs.cart_value,
            ac.abandonment_reason,
            ac.abandonment_probability,
            ac.recovery_probability,
            ROUND((cs.cart_value * ac.recovery_probability * 1.2)::NUMERIC, 2) AS priority_score,
            ac.status,
            ac.detected_at,
            cs.device,
            cs.payment_method
        FROM abandoned_carts ac
        JOIN checkout_sessions cs ON ac.checkout_id = cs.checkout_id
        JOIN customers c ON cs.customer_id = c.customer_id
        WHERE {' AND '.join(where_clauses)}
        ORDER BY {order_clause}
        LIMIT :limit OFFSET :offset;
    """)

    rows = db.execute(sql, params).fetchall()
    return [
        {
            "abandoned_cart_id": r.abandoned_cart_id,
            "checkout_id": r.checkout_id,
            "customer_id": r.customer_id,
            "customer_segment": r.customer_segment,
            "cart_value": float(r.cart_value),
            "abandonment_reason": r.abandonment_reason,
            "abandonment_probability": float(r.abandonment_probability),
            "recovery_probability": float(r.recovery_probability),
            "priority_score": float(r.priority_score),
            "status": r.status,
            "detected_at": r.detected_at,
            "device": r.device,
            "payment_method": r.payment_method
        }
        for r in rows
    ]

@router.get("/{checkout_id}")
def get_checkout_detail(checkout_id: str, db: Session = Depends(get_db)):
    """Fetches full telemetry and associated abandoned cart for a specific checkout."""
    sql = text("""
        SELECT 
            cs.*,
            c.customer_segment, c.previous_orders, c.previous_abandonments,
            ac.abandoned_cart_id, ac.abandonment_reason, ac.recovery_probability, ac.status AS cart_status
        FROM checkout_sessions cs
        JOIN customers c ON cs.customer_id = c.customer_id
        LEFT JOIN abandoned_carts ac ON cs.checkout_id = ac.checkout_id
        WHERE cs.checkout_id = :chk_id;
    """)
    row = db.execute(sql, {"chk_id": checkout_id}).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Checkout session not found")
    return dict(row._mapping)
