import uuid
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db
from backend.app.schemas.intervention import InterventionExecuteRequest, InterventionExecuteResponse
from backend.app.config import settings

router = APIRouter(prefix="/interventions", tags=["Interventions"])

@router.get("")
def list_interventions(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    status: str = Query(None, description="Filter by status: PENDING, SENT, CONVERTED, FAILED"),
    channel: str = Query(None, description="EMAIL, SMS, WHATSAPP"),
    db: Session = Depends(get_db)
):
    """Lists recent recovery interventions and their live status."""
    where = ["1=1"]
    params = {"limit": limit, "offset": offset}
    if status:
        where.append("i.status = :status")
        params["status"] = status.upper()
    if channel:
        where.append("i.channel = :channel")
        params["channel"] = channel.upper()

    sql = text(f"""
        SELECT 
            i.intervention_id,
            i.abandoned_cart_id,
            i.channel,
            i.action,
            i.sent_at,
            i.intervention_cost,
            i.discount_cost,
            i.status,
            cs.cart_value,
            c.customer_id,
            c.customer_segment,
            cv.order_value AS recovered_value,
            cv.recovered_profit
        FROM interventions i
        JOIN abandoned_carts ac ON i.abandoned_cart_id = ac.abandoned_cart_id
        JOIN checkout_sessions cs ON ac.checkout_id = cs.checkout_id
        JOIN customers c ON cs.customer_id = c.customer_id
        LEFT JOIN conversions cv ON i.intervention_id = cv.intervention_id
        WHERE {' AND '.join(where)}
        ORDER BY i.sent_at DESC NULLS LAST
        LIMIT :limit OFFSET :offset;
    """)
    rows = db.execute(sql, params).fetchall()
    return [dict(r._mapping) for r in rows]

@router.post("/{intervention_id}/execute", response_model=InterventionExecuteResponse)
def execute_recovery_intervention(
    intervention_id: str,
    req: InterventionExecuteRequest,
    db: Session = Depends(get_db)
):
    """
    Executes and simulates real-time intervention workflow:
    Intervention Dispatched -> Customer Opened & Responded -> Cart Resumed -> Purchase Converted.
    Persists state updates and recorded conversion in PostgreSQL.
    """
    # 1. Fetch intervention and cart details
    sql = text("""
        SELECT 
            i.*,
            ac.abandoned_cart_id,
            ac.recovery_probability,
            cs.cart_value,
            cs.customer_id
        FROM interventions i
        JOIN abandoned_carts ac ON i.abandoned_cart_id = ac.abandoned_cart_id
        JOIN checkout_sessions cs ON ac.checkout_id = cs.checkout_id
        WHERE i.intervention_id = :intv_id;
    """)
    intv = db.execute(sql, {"intv_id": intervention_id}).fetchone()
    if not intv:
        # If passed an abandoned_cart_id instead or creating a new simulation
        sql_cart = text("""
            SELECT 
                ac.abandoned_cart_id,
                ac.recovery_probability,
                cs.cart_value,
                cs.customer_id
            FROM abandoned_carts ac
            JOIN checkout_sessions cs ON ac.checkout_id = cs.checkout_id
            WHERE ac.abandoned_cart_id = :cart_id;
        """)
        cart = db.execute(sql_cart, {"cart_id": intervention_id}).fetchone()
        if not cart:
            raise HTTPException(status_code=404, detail="Intervention or Abandoned Cart record not found")
        # Create on-the-fly intervention record
        new_intv_id = f"INT_{random.randint(2000000, 9999999)}"
        cart_value = float(cart.cart_value)
        cust_id = cart.customer_id
        cart_id = cart.abandoned_cart_id
        rec_prob = float(cart.recovery_probability)
    else:
        new_intv_id = intv.intervention_id
        cart_value = float(intv.cart_value)
        cust_id = intv.customer_id
        cart_id = intv.abandoned_cart_id
        rec_prob = float(intv.recovery_probability)

    # 2. Simulate customer conversion based on recovery probability + action lift
    action_boost = 0.25 if req.action in ['FREE_SHIPPING', 'PAYMENT_ASSISTANCE', 'DISCOUNT_5'] else 0.15
    effective_prob = min(rec_prob + action_boost, 0.95)
    converted = random.random() < effective_prob

    now = datetime.utcnow()

    if converted:
        recovered_revenue = cart_value
        gross_profit = recovered_revenue * settings.GROSS_MARGIN
        discount_incurred = float(req.discount_cost)
        channel_cost = 1.50 if req.channel == 'WHATSAPP' else 0.80 if req.channel == 'SMS' else 0.20
        net_profit = round(gross_profit - discount_incurred - channel_cost, 2)

        # Update abandoned cart status
        db.execute(
            text("UPDATE abandoned_carts SET status = 'RECOVERED' WHERE abandoned_cart_id = :c_id;"),
            {"c_id": cart_id}
        )

        # Update or insert intervention
        db.execute(text("""
            INSERT INTO interventions (intervention_id, abandoned_cart_id, channel, action, sent_at, intervention_cost, discount_cost, status)
            VALUES (:i_id, :c_id, :channel, :action, :sent_at, :cost, :disc, 'CONVERTED')
            ON CONFLICT (intervention_id) DO UPDATE 
            SET channel = EXCLUDED.channel, action = EXCLUDED.action, status = 'CONVERTED', sent_at = EXCLUDED.sent_at;
        """), {
            "i_id": new_intv_id,
            "c_id": cart_id,
            "channel": req.channel,
            "action": req.action,
            "sent_at": now,
            "cost": channel_cost,
            "disc": discount_incurred
        })

        # Insert conversion record
        conv_id = f"CONV_{random.randint(2000000, 9999999)}"
        db.execute(text("""
            INSERT INTO conversions (conversion_id, intervention_id, customer_id, order_value, recovered_profit, converted_at)
            VALUES (:conv_id, :intv_id, :cust_id, :val, :profit, :now);
        """), {
            "conv_id": conv_id,
            "intv_id": new_intv_id,
            "cust_id": cust_id,
            "val": recovered_revenue,
            "profit": net_profit,
            "now": now
        })
        db.commit()

        customer_response = f"Customer clicked recovery link via {req.channel} and completed purchase of Rs. {cart_value:,.2f}."
        msg = f"SUCCESS: Revenue recovered! Rs. {cart_value:,.2f} recovered with net profit of Rs. {net_profit:,.2f}."
        status_code = "CONVERTED"
    else:
        # Failed attempt
        db.execute(
            text("UPDATE abandoned_carts SET status = 'LOST' WHERE abandoned_cart_id = :c_id;"),
            {"c_id": cart_id}
        )
        db.commit()
        customer_response = f"Intervention delivered via {req.channel}, but customer did not complete checkout within engagement window."
        msg = "Customer engaged but chose not to complete purchase."
        recovered_revenue = 0.0
        net_profit = - (1.50 if req.channel == 'WHATSAPP' else 0.80)
        status_code = "LOST"

    return {
        "intervention_id": new_intv_id,
        "abandoned_cart_id": cart_id,
        "status": status_code,
        "action": req.action,
        "channel": req.channel,
        "sent_at": now,
        "customer_response": customer_response,
        "converted": converted,
        "order_value": recovered_revenue,
        "recovered_profit": net_profit,
        "message": msg
    }
