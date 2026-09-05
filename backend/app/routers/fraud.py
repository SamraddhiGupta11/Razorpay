from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Dict, Any, List
from backend.app.database import get_db
from backend.app.ml.service import ml_service

router = APIRouter(prefix="/fraud", tags=["Fraud & Anomaly Detection"])

@router.get("/overview")
def get_fraud_overview(db: Session = Depends(get_db)):
    """Fraud alerts overview and signal counts."""
    sql = text("""
        SELECT 
            COUNT(*) as total_events,
            SUM(CASE WHEN risk_level IN ('HIGH', 'CRITICAL', 'ENHANCED_VERIFICATION', 'MANUAL_REVIEW') THEN 1 ELSE 0 END) as critical_alerts,
            SUM(CASE WHEN risk_level = 'MONITOR' THEN 1 ELSE 0 END) as monitored_accounts,
            SUM(CASE WHEN risk_level = 'LOW_RISK' THEN 1 ELSE 0 END) as cleared_accounts
        FROM fraud_events;
    """)
    row = db.execute(sql).fetchone()

    total = int(row.total_events) if row else 400
    crit = int(row.critical_alerts) if row else 85
    mon = int(row.monitored_accounts) if row else 145
    low = int(row.cleared_accounts) if row else 170

    # Risk level distribution
    sql_dist = text("SELECT risk_level, COUNT(*) as count FROM fraud_events GROUP BY risk_level;")
    dist = {r.risk_level: int(r.count) for r in db.execute(sql_dist).fetchall()}

    return {
        "success": True,
        "total_fraud_events": total,
        "critical_alerts": crit,
        "monitored_accounts": mon,
        "cleared_accounts": low,
        "risk_distribution": dist,
        "prevention_protocol": "Proportionate verification and manual review without blocking legitimate customers."
    }

@router.get("/alerts")
def get_fraud_alerts(
    limit: int = Query(20, ge=1, le=100),
    risk_level: str = Query(None),
    db: Session = Depends(get_db)
):
    """List of active fraud alerts with anomaly signals and recommended actions."""
    filter_clause = "WHERE fe.risk_level = :risk" if risk_level else ""
    sql = text(f"""
        SELECT 
            fe.fraud_id,
            fe.customer_id,
            c.name as customer_name,
            c.customer_segment,
            c.location,
            fe.fraud_score,
            fe.risk_level,
            fe.signals,
            fe.recommended_action,
            fe.status,
            fe.created_at
        FROM fraud_events fe
        JOIN customers c ON fe.customer_id = c.customer_id
        {filter_clause}
        ORDER BY fe.fraud_score DESC
        LIMIT :limit;
    """)
    params = {"limit": limit}
    if risk_level:
        params["risk"] = risk_level.upper()

    rows = db.execute(sql, params).fetchall()
    alerts = [
        {
            "fraud_id": r.fraud_id,
            "customer_id": r.customer_id,
            "customer_name": r.customer_name,
            "customer_segment": r.customer_segment,
            "location": r.location,
            "fraud_score": float(r.fraud_score),
            "risk_level": r.risk_level,
            "signals": r.signals,
            "recommended_action": r.recommended_action,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in rows
    ]
    return alerts

@router.post("/analyze")
def analyze_fraud_anomaly(payload: Dict[str, Any]):
    """Evaluates multi-factor anomaly signals and prescribes proportionate action."""
    return ml_service.analyze_fraud(payload)
