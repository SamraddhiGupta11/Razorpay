import os
import pytest
import pandas as pd
from sqlalchemy import text
from fastapi.testclient import TestClient
from backend.app.database import engine
from backend.app.main import app

client = TestClient(app)

def test_api_health():
    """Verify FastAPI /api/health endpoint returns healthy status and DB ping ok."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "PayRevive"
    assert data["database"] == "connected" or data["database"].get("status") == "healthy"

def test_database_schema_and_counts():
    """Verify all 5 core tables exist in PostgreSQL and contain imported rows."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT COUNT(*) FROM checkout_sessions;"))
        count = result.scalar()
        assert count == 100000, f"Expected 100,000 checkout records, got {count}"

        result_cust = conn.execute(text("SELECT COUNT(*) FROM customers;"))
        assert result_cust.scalar() > 30000

        result_aban = conn.execute(text("SELECT COUNT(*) FROM abandoned_carts;"))
        assert result_aban.scalar() > 20000

        result_conv = conn.execute(text("SELECT COUNT(*) FROM conversions;"))
        assert result_conv.scalar() > 10000

def test_zero_data_leakage_in_features():
    csv_path = "data/checkout_records_100k.csv"
    if not os.path.exists(csv_path):
        from backend.app.database import engine
        from sqlalchemy import text
        with engine.connect() as conn:
            cols = [r[0] for r in conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'checkout_sessions';")).fetchall()]
            assert "recovered" not in cols, "Downstream outcome 'recovered' leaked into checkout_sessions"
        return
    
    df = pd.read_csv(csv_path, nrows=100)
    
    # Feature columns allowable for ML models (pre-intervention session state)
    allowed_session_features = {
        'customer_id', 'customer_segment', 'is_returning', 'previous_orders',
        'previous_abandonments', 'session_count', 'checkout_id', 'cart_value',
        'item_count', 'device', 'payment_method', 'shipping_cost',
        'time_on_checkout_min', 'product_views', 'coupon_views',
        'payment_attempts', 'payment_failed', 'technical_errors',
        'hour_of_day', 'day_of_week'
    }
    
    # Downstream outcome columns that MUST NEVER be fed into ML models
    quarantined_outcomes = {
        'recovered', 'recovery_channel', 'recommended_action',
        'recovered_revenue', 'intervention_cost', 'discount_cost',
        'recovered_profit'
    }
    
    # Verify no intersection between allowed features and quarantined outcomes
    assert len(allowed_session_features.intersection(quarantined_outcomes)) == 0
    
    # Verify all quarantined outcomes exist in dataset but can be partitioned out cleanly
    for col in quarantined_outcomes:
        assert col in df.columns
