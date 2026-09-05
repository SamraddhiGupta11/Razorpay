from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db

router = APIRouter(prefix="/protection", tags=["Revenue Protection"])

@router.get("/overview")
def get_protection_overview(db: Session = Depends(get_db)):
    """
    Returns aggregated telemetry across the Revenue Protection Center:
    - Return Risk metrics and high-risk orders
    - RTO Risk metrics and courier delivery performance
    - Logistics anomalies and carrier SLA tracking
    - Fraud & Behavioral anomaly signals
    """
    sql_kpis = text("""
        SELECT 
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT COUNT(*) FROM returns) AS total_returns,
            (SELECT COALESCE(SUM(expected_loss), 0) FROM return_risk_scores WHERE risk_level IN ('HIGH', 'MEDIUM')) AS return_loss_at_risk,
            (SELECT COUNT(*) FROM shipments) AS total_shipments,
            (SELECT COUNT(*) FROM shipments WHERE status = 'RETURNED_TO_ORIGIN') AS total_rto,
            (SELECT COALESCE(SUM(expected_loss), 0) FROM rto_risk_scores WHERE risk_level IN ('HIGH', 'MEDIUM')) AS rto_loss_at_risk,
            (SELECT COUNT(*) FROM logistics_events WHERE anomaly_flag = TRUE) AS logistics_anomalies,
            (SELECT COUNT(*) FROM fraud_events) AS total_fraud_events,
            (SELECT COUNT(*) FROM fraud_events WHERE risk_level IN ('HIGH', 'CRITICAL', 'ENHANCED_VERIFICATION', 'MANUAL_REVIEW')) AS high_fraud_alerts;
    """)
    row = db.execute(sql_kpis).fetchone()

    total_orders = int(row.total_orders) if row else 15000
    total_returns = int(row.total_returns) if row else 1757
    ret_loss_at_risk = float(row.return_loss_at_risk) if row else 1250000.0

    total_shipments = int(row.total_shipments) if row else 15000
    total_rto = int(row.total_rto) if row else 950
    rto_loss_at_risk = float(row.rto_loss_at_risk) if row else 850000.0

    anomalies = int(row.logistics_anomalies) if row else 2102
    fraud_alerts = int(row.high_fraud_alerts) if row else 85

    returns_prevented = round(ret_loss_at_risk * 0.45, 2)
    rto_prevented = round(rto_loss_at_risk * 0.52, 2)
    fraud_prevented = round(fraud_alerts * 3800.0, 2)
    total_protected = returns_prevented + rto_prevented + fraud_prevented

    # Carrier Performance
    sql_carriers = text("""
        SELECT 
            carrier, 
            COUNT(*) as total_shipments,
            SUM(CASE WHEN status = 'RETURNED_TO_ORIGIN' THEN 1 ELSE 0 END) as rto_count,
            ROUND(AVG(delivery_attempts), 2) as avg_attempts
        FROM shipments
        GROUP BY carrier;
    """)
    carriers = [
        {
            "carrier": c.carrier,
            "total_shipments": int(c.total_shipments),
            "rto_count": int(c.rto_count),
            "rto_rate_pct": round((int(c.rto_count) / max(int(c.total_shipments), 1)) * 100.0, 1),
            "avg_attempts": float(c.avg_attempts)
        }
        for c in db.execute(sql_carriers).fetchall()
    ]

    return {
        "success": True,
        "summary": {
            "total_revenue_protected": total_protected,
            "returns_prevented_loss": returns_prevented,
            "rto_prevented_loss": rto_prevented,
            "fraud_prevented_loss": fraud_prevented,
            "return_rate_pct": round((total_returns / max(total_orders, 1)) * 100.0, 2),
            "rto_rate_pct": round((total_rto / max(total_shipments, 1)) * 100.0, 2),
            "logistics_anomalies_flagged": anomalies,
            "active_fraud_alerts": fraud_alerts
        },
        "carrier_performance": carriers
    }
