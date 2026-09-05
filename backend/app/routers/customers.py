from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, List, Dict, Any
from backend.app.database import get_db

router = APIRouter(prefix="", tags=["Customers & Customer 360"])

@router.get("/customers")
def get_customers(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    segment: Optional[str] = Query(None, description="VIP, Regular, Occasional, New"),
    search: Optional[str] = Query(None, description="Search by customer_id or name"),
    db: Session = Depends(get_db)
):
    """Fetches paginated customers with enriched attributes."""
    where = ["1=1"]
    params = {"limit": limit, "offset": offset}
    if segment:
        where.append("customer_segment = :segment")
        params["segment"] = segment
    if search:
        where.append("(customer_id ILIKE :search OR name ILIKE :search)")
        params["search"] = f"%{search}%"

    sql = text(f"""
        SELECT 
            customer_id, name, email, phone, location, customer_segment,
            is_returning, previous_orders, previous_abandonments,
            lifetime_orders, lifetime_value, average_order_value,
            return_rate, cancellation_rate, preferred_payment_method, preferred_channel,
            created_at
        FROM customers
        WHERE {' AND '.join(where)}
        ORDER BY previous_orders DESC, created_at DESC
        LIMIT :limit OFFSET :offset;
    """)
    rows = db.execute(sql, params).fetchall()
    return [
        {
            "customer_id": r.customer_id,
            "name": r.name or r.customer_id,
            "email": r.email,
            "phone": r.phone,
            "location": r.location,
            "customer_segment": r.customer_segment,
            "is_returning": bool(r.is_returning),
            "previous_orders": int(r.previous_orders),
            "previous_abandonments": int(r.previous_abandonments),
            "lifetime_orders": int(r.lifetime_orders or r.previous_orders),
            "lifetime_value": float(r.lifetime_value or 0.0),
            "average_order_value": float(r.average_order_value or 0.0),
            "return_rate": float(r.return_rate or 0.0),
            "preferred_payment_method": r.preferred_payment_method,
            "preferred_channel": r.preferred_channel,
            "created_at": r.created_at
        }
        for r in rows
    ]

@router.get("/customers/{customer_id}")
@router.get("/customer-360/{customer_id}")
@router.get("/customer/{customer_id}")
def get_customer_360(customer_id: str, db: Session = Depends(get_db)):
    """
    Comprehensive Customer 360 View:
    - Demographic Profile
    - Lifetime Revenue, AOV, Order Frequency
    - Unified Revenue Risk Score & Radar Breakdown
    - Order History & Status
    - Abandoned Checkouts & Recovery History
    - Returns & Shipments
    - Voice of Customer Reviews & Aspect Sentiments
    - Recommended Next Best Action & Financial Value
    """
    # 1. Customer profile
    sql_cust = text("SELECT * FROM customers WHERE customer_id = :cid;")
    c = db.execute(sql_cust, {"cid": customer_id}).fetchone()
    if not c:
        raise HTTPException(status_code=404, detail="Customer not found.")

    # 2. Orders History
    sql_orders = text("""
        SELECT o.order_id, p.product_name, p.category, o.order_value, o.payment_method, o.order_status, o.created_at
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        WHERE o.customer_id = :cid
        ORDER BY o.created_at DESC
        LIMIT 10;
    """)
    orders = [
        {
            "order_id": r.order_id,
            "product_name": r.product_name,
            "category": r.category,
            "order_value": float(r.order_value),
            "payment_method": r.payment_method,
            "status": r.order_status,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in db.execute(sql_orders, {"cid": customer_id}).fetchall()
    ]

    # 3. Checkout sessions & dropoffs
    sql_drops = text("""
        SELECT cs.checkout_id, cs.cart_value, cs.shipping_cost, cs.payment_method, ac.abandonment_reason, ac.status, cs.started_at
        FROM checkout_sessions cs
        LEFT JOIN abandoned_carts ac ON cs.checkout_id = ac.checkout_id
        WHERE cs.customer_id = :cid
        ORDER BY cs.started_at DESC
        LIMIT 5;
    """)
    checkouts = [
        {
            "checkout_id": r.checkout_id,
            "cart_value": float(r.cart_value),
            "shipping_cost": float(r.shipping_cost),
            "payment_method": r.payment_method,
            "reason": r.abandonment_reason,
            "status": r.status or "COMPLETED",
            "started_at": r.started_at.isoformat() if r.started_at else None
        }
        for r in db.execute(sql_drops, {"cid": customer_id}).fetchall()
    ]

    # 4. Returns history
    sql_returns = text("""
        SELECT r.return_id, p.product_name, r.reason, r.status, r.refund_amount, r.created_at
        FROM returns r
        JOIN products p ON r.product_id = p.product_id
        WHERE r.customer_id = :cid
        ORDER BY r.created_at DESC;
    """)
    returns = [
        {
            "return_id": r.return_id,
            "product_name": r.product_name,
            "reason": r.reason,
            "status": r.status,
            "refund_amount": float(r.refund_amount),
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in db.execute(sql_returns, {"cid": customer_id}).fetchall()
    ]

    # 5. Reviews & Sentiment
    sql_revs = text("""
        SELECT r.review_text, r.rating, ra.sentiment, ra.sentiment_score, ra.language_detected, r.created_at
        FROM reviews r
        JOIN review_analysis ra ON r.review_id = ra.review_id
        WHERE r.customer_id = :cid
        ORDER BY r.created_at DESC;
    """)
    reviews = [
        {
            "review_text": r.review_text,
            "rating": int(r.rating),
            "sentiment": r.sentiment,
            "sentiment_score": float(r.sentiment_score),
            "language": r.language_detected,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in db.execute(sql_revs, {"cid": customer_id}).fetchall()
    ]

    # 6. Unified Revenue Risk Score & Radar Breakdown
    ret_rate = float(c.return_rate or 0.0)
    canc_rate = float(c.cancellation_rate or 0.0)
    prev_abandons = int(c.previous_abandonments or 0)
    
    abandonment_risk = min(prev_abandons * 20.0, 85.0)
    return_risk = min(ret_rate * 250.0, 90.0)
    rto_risk = min(canc_rate * 200.0, 80.0)
    fraud_risk = 15.0 if ret_rate < 0.2 else 65.0
    cx_risk = 10.0 if not reviews else (75.0 if reviews[0]["sentiment"] == "NEGATIVE" else 15.0)

    composite_score = round((abandonment_risk * 0.3) + (return_risk * 0.25) + (rto_risk * 0.2) + (fraud_risk * 0.15) + (cx_risk * 0.1), 1)

    # 7. Recommended Action
    if c.customer_segment == 'VIP':
        rec_action = "VIP_CONCIERGE"
        exp_impact = 18500.0
        rationale = "High lifetime value VIP customer; proactively assign priority concierge."
    elif return_risk > 50.0:
        rec_action = "SIZE_RECOMMENDATION"
        exp_impact = 3500.0
        rationale = "High sizing return tendency; activate automated fit clarification on orders."
    elif rto_risk > 40.0:
        rec_action = "PAYMENT_PREPAID_REQUEST"
        exp_impact = 2200.0
        rationale = "Elevated cancellation history; incentivize prepayment on COD orders."
    else:
        rec_action = "PERSONALIZED_REMINDER"
        exp_impact = 4500.0
        rationale = "Send timely engagement reminder via WhatsApp."

    return {
        "success": True,
        "profile": {
            "customer_id": c.customer_id,
            "name": c.name or c.customer_id,
            "email": c.email,
            "phone": c.phone,
            "location": c.location,
            "customer_segment": c.customer_segment,
            "lifetime_orders": int(c.lifetime_orders or c.previous_orders or 1),
            "lifetime_value": float(c.lifetime_value or 0.0),
            "average_order_value": float(c.average_order_value or 0.0),
            "return_rate_pct": round(ret_rate * 100, 1),
            "preferred_payment_method": c.preferred_payment_method,
            "preferred_channel": c.preferred_channel
        },
        "unified_revenue_risk": {
            "composite_score": composite_score,
            "risk_tier": "CRITICAL" if composite_score >= 65 else ("ELEVATED" if composite_score >= 40 else "HEALTHY"),
            "components": {
                "abandonment_risk": round(abandonment_risk, 1),
                "return_risk": round(return_risk, 1),
                "rto_risk": round(rto_risk, 1),
                "fraud_risk": round(fraud_risk, 1),
                "cx_friction_risk": round(cx_risk, 1)
            }
        },
        "next_best_action": {
            "recommended_action": rec_action,
            "channel": c.preferred_channel or "WHATSAPP",
            "expected_financial_benefit": exp_impact,
            "rationale": rationale
        },
        "history": {
            "orders": orders,
            "checkouts": checkouts,
            "returns": returns,
            "reviews": reviews
        }
    }
