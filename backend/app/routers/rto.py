from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Dict, Any, List
from backend.app.database import get_db
from backend.app.ml.service import ml_service

router = APIRouter(prefix="/rto", tags=["RTO Risk Engine"])

@router.get("/overview")
def get_rto_overview(db: Session = Depends(get_db)):
    """Summary of RTO rates, COD volumes, and risk distribution."""
    sql = text("""
        SELECT 
            COUNT(*) as total_shipments,
            SUM(CASE WHEN is_cod = TRUE THEN 1 ELSE 0 END) as cod_shipments,
            SUM(CASE WHEN status = 'RETURNED_TO_ORIGIN' THEN 1 ELSE 0 END) as rto_shipments,
            SUM(CASE WHEN is_cod = TRUE AND status = 'RETURNED_TO_ORIGIN' THEN 1 ELSE 0 END) as cod_rto_shipments,
            COALESCE(SUM(CASE WHEN status = 'RETURNED_TO_ORIGIN' THEN cod_amount ELSE 0 END), 0) as rto_lost_cash_value
        FROM shipments;
    """)
    row = db.execute(sql).fetchone()

    total_ship = int(row.total_shipments) if row else 15000
    cod_ship = int(row.cod_shipments) if row else 6800
    rto_ship = int(row.rto_shipments) if row else 950
    cod_rto = int(row.cod_rto_shipments) if row else 780
    rto_cash = float(row.rto_lost_cash_value) if row else 1850000.0

    # Risk level distribution
    sql_dist = text("SELECT risk_level, COUNT(*) as count FROM rto_risk_scores GROUP BY risk_level;")
    dist = {r.risk_level: int(r.count) for r in db.execute(sql_dist).fetchall()}

    # Regional RTO breakdown
    sql_region = text("""
        SELECT destination_region, COUNT(*) as total, SUM(CASE WHEN status = 'RETURNED_TO_ORIGIN' THEN 1 ELSE 0 END) as rto_count
        FROM shipments
        GROUP BY destination_region;
    """)
    regions = [
        {
            "region": r.destination_region,
            "total_shipments": int(r.total),
            "rto_count": int(r.rto_count),
            "rto_rate_pct": round((int(r.rto_count) / max(int(r.total), 1)) * 100.0, 1)
        }
        for r in db.execute(sql_region).fetchall()
    ]

    return {
        "success": True,
        "total_shipments": total_ship,
        "cod_shipments": cod_ship,
        "rto_shipments": rto_ship,
        "overall_rto_rate_pct": round((rto_ship / max(total_ship, 1)) * 100.0, 2),
        "cod_rto_rate_pct": round((cod_rto / max(cod_ship, 1)) * 100.0, 2),
        "rto_cash_value": rto_cash,
        "risk_distribution": dist,
        "regional_rto": regions
    }

@router.get("/shipments")
def get_rto_risk_shipments(
    limit: int = Query(20, ge=1, le=100),
    risk_level: str = Query(None),
    is_cod: bool = Query(None),
    db: Session = Depends(get_db)
):
    """Queue of active shipments with RTO risk predictions and recommended mitigation."""
    clauses = []
    params = {"limit": limit}
    if risk_level:
        clauses.append("rrs.risk_level = :risk")
        params["risk"] = risk_level.upper()
    if is_cod is not None:
        clauses.append("s.is_cod = :cod")
        params["cod"] = is_cod

    where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""

    sql = text(f"""
        SELECT 
            s.shipment_id,
            s.carrier,
            s.tracking_number,
            s.destination_region,
            s.destination_pincode,
            s.is_cod,
            s.cod_amount,
            s.delivery_attempts,
            s.status,
            rrs.rto_probability,
            rrs.risk_level,
            rrs.expected_loss,
            rrs.recommended_action,
            rrs.action_status,
            c.name as customer_name
        FROM rto_risk_scores rrs
        JOIN shipments s ON rrs.shipment_id = s.shipment_id
        JOIN orders o ON s.order_id = o.order_id
        JOIN customers c ON o.customer_id = c.customer_id
        {where_sql}
        ORDER BY rrs.rto_probability DESC
        LIMIT :limit;
    """)

    rows = db.execute(sql, params).fetchall()
    shipments = [
        {
            "shipment_id": r.shipment_id,
            "carrier": r.carrier,
            "tracking_number": r.tracking_number,
            "destination_region": r.destination_region,
            "destination_pincode": r.destination_pincode,
            "is_cod": bool(r.is_cod),
            "cod_amount": float(r.cod_amount),
            "delivery_attempts": int(r.delivery_attempts),
            "status": r.status,
            "rto_probability": float(r.rto_probability),
            "risk_level": r.risk_level,
            "expected_loss": float(r.expected_loss),
            "recommended_action": r.recommended_action,
            "action_status": r.action_status,
            "customer_name": r.customer_name
        }
        for r in rows
    ]
    return shipments

@router.post("/predict")
def predict_shipment_rto_risk(payload: Dict[str, Any]):
    """Runs Model 4 to predict RTO risk and prescribe mitigation action with transparent ROI."""
    return ml_service.predict_rto_risk(payload)
