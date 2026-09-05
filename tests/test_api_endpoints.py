"""
PAYREVIVE COMPREHENSIVE ENDPOINT TEST SUITE
Covers all major routes across the Three Pillars (RECOVER, PROTECT, LISTEN):
- Health, Executive Dashboard, Recovery, Protection, Returns, RTO, Fraud,
- Voice of Customer NLP & Recommendations, Customer 360, Decision Engine,
- What-If Simulator, Model Audit, and Demo Scenarios.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoints():
    res1 = client.get("/health")
    assert res1.status_code == 200
    assert res1.json()["status"] == "healthy"
    assert res1.json()["database"] == "connected"
    assert res1.json()["models"] == "loaded"

    res2 = client.get("/api/health")
    assert res2.status_code == 200
    assert res2.json()["status"] == "healthy"

def test_unified_dashboard():
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "executive_kpis" in data
    assert data["executive_kpis"]["revenue_recovered"] > 0
    assert data["executive_kpis"]["revenue_protected"] > 0
    assert "pillar_summary" in data
    assert "recover" in data["pillar_summary"]
    assert "protect" in data["pillar_summary"]
    assert "listen" in data["pillar_summary"]

def test_dashboard_summary_and_charts():
    res1 = client.get("/api/dashboard/summary")
    assert res1.status_code == 200
    assert res1.json()["total_checkouts"] >= 100000

    res2 = client.get("/api/dashboard/charts")
    assert res2.status_code == 200
    assert len(res2.json()["reasons"]) > 0
    assert len(res2.json()["channels"]) > 0

def test_recovery_overview():
    res = client.get("/api/recovery/overview")
    assert res.status_code == 200
    assert res.json()["total_checkouts"] >= 100000
    assert res.json()["revenue_recovered"] > 0

def test_protection_overview():
    res = client.get("/api/protection/overview")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["summary"]["total_revenue_protected"] > 0
    assert len(data["carrier_performance"]) > 0

def test_returns_overview_and_orders():
    res1 = client.get("/api/returns/overview")
    assert res1.status_code == 200
    assert res1.json()["total_orders"] >= 10000

    res2 = client.get("/api/returns/orders?limit=5")
    assert res2.status_code == 200
    assert len(res2.json()) == 5
    assert "return_probability" in res2.json()[0]

def test_returns_predict():
    payload = {
        "order_value": 4500.0,
        "category": "Fashion",
        "size_sensitive": True,
        "customer_return_rate": 0.20,
        "product_return_rate": 0.15
    }
    res = client.post("/api/returns/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "return_probability" in data
    assert "explainability" in data
    assert "decision" in data
    assert data["decision"]["recommended_action"] == "SIZE_RECOMMENDATION"

def test_rto_overview_and_shipments():
    res1 = client.get("/api/rto/overview")
    assert res1.status_code == 200
    assert res1.json()["total_shipments"] >= 10000

    res2 = client.get("/api/rto/shipments?limit=5")
    assert res2.status_code == 200
    assert len(res2.json()) == 5
    assert "rto_probability" in res2.json()[0]

def test_rto_predict():
    payload = {
        "order_value": 3500.0,
        "is_cod": True,
        "delivery_attempts": 2,
        "destination_region": "North"
    }
    res = client.post("/api/rto/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "rto_probability" in data
    assert "decision" in data

def test_fraud_overview_and_alerts():
    res1 = client.get("/api/fraud/overview")
    assert res1.status_code == 200
    assert res1.json()["total_fraud_events"] >= 100

    res2 = client.get("/api/fraud/alerts?limit=5")
    assert res2.status_code == 200
    assert len(res2.json()) == 5
    assert "fraud_score" in res2.json()[0]

def test_fraud_analyze():
    payload = {
        "order_value": 55000.0,
        "is_cod": True,
        "return_rate": 0.40,
        "cancellation_rate": 0.35
    }
    res = client.post("/api/fraud/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_level"] in ["HIGH", "CRITICAL", "ENHANCED_VERIFICATION", "MANUAL_REVIEW"]
    assert "action_comparison_matrix" in data

def test_reviews_insights_and_recs():
    res1 = client.get("/api/reviews/insights")
    assert res1.status_code == 200
    assert "aspect_radar" in res1.json()

    res2 = client.get("/api/reviews/recommendations")
    assert res2.status_code == 200
    assert len(res2.json()) > 0
    assert "estimated_monthly_impact" in res2.json()[0]

def test_reviews_single_analyze():
    payload = {
        "review_text": "Product accha hai but delivery bahut late thi!",
        "rating": 2
    }
    res = client.post("/api/reviews/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["language_detected"] == "Hinglish"
    assert len(data["aspects"]) >= 1

def test_customer_360_profile():
    res = client.get("/api/customer/DEMO_CUST_RAHUL")
    assert res.status_code == 200
    data = res.json()
    assert data["profile"]["name"] == "Rahul Sharma"
    assert "unified_revenue_risk" in data
    assert "next_best_action" in data
    assert "history" in data

def test_decision_unified_next_best_action():
    payload = {
        "pillar": "RECOVER",
        "cart_value": 80000.0,
        "shipping_cost": 1500.0,
        "customer_segment": "VIP"
    }
    res = client.post("/api/decision/next-best-action", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "decision" in data
    assert data["decision"]["recommended_action"] == "FREE_SHIPPING"

def test_simulator_calculate():
    payload = {
        "checkout_volume": 50000,
        "avg_cart_value": 3500,
        "abandonment_rate_pct": 34.0,
        "recovery_rate_pct": 28.0,
        "gross_margin_pct": 35.0,
        "return_rate_pct": 12.0,
        "return_reduction_pct": 35.0,
        "rto_rate_pct": 7.0,
        "rto_reduction_pct": 45.0
    }
    res = client.post("/api/simulator/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "recovery" in data
    assert "protection" in data
    assert "totals" in data
    assert data["totals"]["overall_roi_pct"] > 0
    assert "formulas" in data

def test_models_status_and_metrics():
    res1 = client.get("/api/models/status")
    assert res1.status_code == 200
    assert res1.json()["is_loaded"] is True

    res2 = client.get("/api/models/metrics")
    assert res2.status_code == 200
    assert "models" in res2.json()

def test_demo_scenarios():
    res = client.get("/api/demo/scenarios")
    assert res.status_code == 200
    assert len(res.json()) == 8

def test_analytics_trends():
    res = client.get("/api/analytics/trends")
    assert res.status_code == 200
    data = res.json()
    assert len(data["categories"]) > 0
    assert len(data["regions"]) > 0
    assert len(data["top_risk_products"]) > 0
