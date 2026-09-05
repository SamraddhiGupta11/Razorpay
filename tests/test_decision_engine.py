"""
PAYREVIVE DECISION ENGINE & FINANCIAL IMPACT AUTOMATED TESTS
Verifies economic optimization, candidate action matrix calculations,
prevented loss estimations, and transparent ROI formulas.
"""

import pytest
from backend.app.decision_engine.engine import (
    evaluate_next_best_action,
    evaluate_return_prevention_decision,
    evaluate_rto_prevention_decision,
    evaluate_fraud_triage_decision
)

def test_recovery_decision_engine_profit_maximization():
    """Verify Next Best Action picks maximum profit option, not necessarily highest discount."""
    result = evaluate_next_best_action(
        cart_value=80000.0,
        base_recovery_prob=0.50,
        reason='SHIPPING',
        customer_segment='VIP',
        shipping_cost=1500.0
    )
    assert result["recommended_action"] == "FREE_SHIPPING"
    assert result["channel"] == "WHATSAPP"
    assert result["expected_profit"] > 0
    assert result["roi_pct"] > 0
    assert len(result["action_comparison_matrix"]) == 8

def test_recovery_payment_assistance_for_payment_dropoff():
    result = evaluate_next_best_action(
        cart_value=35000.0,
        base_recovery_prob=0.40,
        reason='PAYMENT',
        customer_segment='Regular'
    )
    assert result["recommended_action"] == "PAYMENT_ASSISTANCE"
    assert result["channel"] == "WHATSAPP"
    assert result["expected_profit"] > 0

def test_return_prevention_decision_financial_impact():
    result = evaluate_return_prevention_decision(
        order_value=5000.0,
        return_probability=0.35,
        category='Fashion',
        size_sensitive=True
    )
    assert result["pillar"] == "PROTECT_RETURN"
    assert result["recommended_action"] == "SIZE_RECOMMENDATION"
    assert result["prevented_loss"] > result["action_cost"]
    assert result["expected_net_benefit"] > 0
    assert len(result["action_comparison_matrix"]) == 5

def test_rto_prevention_decision_financial_impact():
    result = evaluate_rto_prevention_decision(
        order_value=4500.0,
        rto_probability=0.40,
        is_cod=True,
        delivery_attempts=2
    )
    assert result["pillar"] == "PROTECT_RTO"
    assert result["recommended_action"] in ["PAYMENT_PREPAID_REQUEST", "ADDRESS_VERIFICATION", "DELIVERY_CONFIRMATION"]
    assert result["prevented_loss"] > 0
    assert result["expected_net_benefit"] > 0
    assert len(result["action_comparison_matrix"]) == 6

def test_fraud_triage_decision_proportionate():
    # Low score -> ALLOW
    low_res = evaluate_fraud_triage_decision(order_value=2500.0, fraud_score=15.0, signals=[])
    assert low_res["recommended_action"] == "ALLOW"
    assert low_res["risk_level"] == "LOW"

    # High score -> ENHANCED_VERIFICATION
    high_res = evaluate_fraud_triage_decision(order_value=25000.0, fraud_score=68.0, signals=[{"type": "VELOCITY"}])
    assert high_res["recommended_action"] == "ENHANCED_VERIFICATION"
    assert high_res["risk_level"] == "HIGH"

    # Critical score -> MANUAL_REVIEW
    crit_res = evaluate_fraud_triage_decision(order_value=45000.0, fraud_score=85.0, signals=[{"type": "ADDRESS_CLUSTERING"}])
    assert crit_res["recommended_action"] == "MANUAL_REVIEW"
    assert crit_res["risk_level"] == "CRITICAL"
