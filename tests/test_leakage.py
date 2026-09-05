"""
PAYREVIVE DATA LEAKAGE AUTOMATED TEST SUITE
Enforces strict quarantine barriers preventing future outcome and target variables
from accidentally entering training or inference feature sets across all models.
"""

import pytest
import pandas as pd
from ml.preprocessing.features import (
    QUARANTINED_OUTCOME_FIELDS,
    assert_no_leakage,
    engineer_features,
    engineer_return_features,
    engineer_rto_features,
    engineer_fraud_features
)

def test_quarantined_outcome_fields_comprehensive():
    """Verify all critical future outcome fields are strictly blacklisted."""
    mandatory_forbidden = [
        'abandoned', 'abandonment_reason', 'recovered', 'recovery_channel',
        'recommended_action', 'recovered_revenue', 'intervention_cost',
        'discount_cost', 'recovered_profit', 'refund_amount',
        'return_completed', 'future_return', 'rto_completed', 'future_rto',
        'fraud_confirmed', 'post_intervention_status'
    ]
    for field in mandatory_forbidden:
        assert field in QUARANTINED_OUTCOME_FIELDS, f"Missing {field} in quarantined list"

def test_assert_no_leakage_triggers_error():
    """Verify that assert_no_leakage raises ValueError when forbidden column is present."""
    clean_cols = ['cart_value', 'shipping_cost', 'item_count', 'customer_segment']
    assert_no_leakage(clean_cols) # Should pass

    leaked_cols = ['cart_value', 'recovered', 'item_count']
    with pytest.raises(ValueError, match="CRITICAL ML ERROR: Data leakage detected!"):
        assert_no_leakage(leaked_cols)

    leaked_return_cols = ['order_value', 'refund_amount']
    with pytest.raises(ValueError, match="CRITICAL ML ERROR: Data leakage detected!"):
        assert_no_leakage(leaked_return_cols)

    leaked_rto_cols = ['order_value', 'rto_completed']
    with pytest.raises(ValueError, match="CRITICAL ML ERROR: Data leakage detected!"):
        assert_no_leakage(leaked_rto_cols)

def test_checkout_feature_engineering_zero_leakage():
    """Verify engineer_features never emits quarantined outcome fields."""
    sample_df = pd.DataFrame([{
        'customer_segment': 'VIP',
        'is_returning': 1,
        'previous_orders': 5,
        'previous_abandonments': 1,
        'session_count': 3,
        'cart_value': 8000.0,
        'item_count': 2,
        'device': 'Mobile',
        'payment_method': 'UPI',
        'shipping_cost': 99.0,
        'time_on_checkout_min': 4.5,
        'product_views': 6,
        'coupon_views': 1,
        'payment_attempts': 2,
        'payment_failed': 0,
        'technical_errors': 0,
        'hour_of_day': 18,
        'day_of_week': 3
    }])
    X = engineer_features(sample_df)
    intersection = set(X.columns).intersection(set(QUARANTINED_OUTCOME_FIELDS))
    assert len(intersection) == 0, f"Leaked columns found: {intersection}"

def test_return_feature_engineering_zero_leakage():
    """Verify engineer_return_features never emits quarantined outcome fields."""
    sample_df = pd.DataFrame([{
        'order_value': 4999.0,
        'discount_percentage': 10.0,
        'customer_return_rate': 0.12,
        'product_return_rate': 0.18,
        'size_sensitive': True,
        'previous_orders': 4,
        'category': 'Fashion',
        'payment_method': 'UPI',
        'shipping_address_region': 'North'
    }])
    X = engineer_return_features(sample_df)
    intersection = set(X.columns).intersection(set(QUARANTINED_OUTCOME_FIELDS))
    assert len(intersection) == 0, f"Leaked return columns found: {intersection}"

def test_rto_feature_engineering_zero_leakage():
    """Verify engineer_rto_features never emits quarantined outcome fields."""
    sample_df = pd.DataFrame([{
        'is_cod': 1,
        'cod_amount': 2500.0,
        'order_value': 2500.0,
        'delivery_attempts': 1,
        'customer_return_rate': 0.05,
        'previous_orders': 2,
        'carrier': 'Delhivery',
        'destination_region': 'East',
        'destination_pincode': '800001'
    }])
    X = engineer_rto_features(sample_df)
    intersection = set(X.columns).intersection(set(QUARANTINED_OUTCOME_FIELDS))
    assert len(intersection) == 0, f"Leaked RTO columns found: {intersection}"

def test_fraud_feature_engineering_zero_leakage():
    """Verify engineer_fraud_features never emits quarantined outcome fields."""
    sample_df = pd.DataFrame([{
        'order_value': 12000.0,
        'is_cod': 0,
        'lifetime_orders': 3,
        'cancellation_rate': 0.0,
        'return_rate': 0.05,
        'payment_attempts': 1
    }])
    X = engineer_fraud_features(sample_df)
    intersection = set(X.columns).intersection(set(QUARANTINED_OUTCOME_FIELDS))
    assert len(intersection) == 0, f"Leaked fraud columns found: {intersection}"
