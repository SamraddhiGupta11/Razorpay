"""
REVIVEAI FEATURE ENGINEERING & LEAKAGE BARRIER
Provides strictly validated feature extraction pipelines for ML models.
Ensures zero future/outcome variables are ever accessed across:
- Checkout Abandonment & Recovery
- Return Risk Prediction
- RTO (Return-To-Origin) Risk Prediction
- Fraud & Behavioral Anomaly Detection
"""

import numpy as np
import pandas as pd
from typing import Tuple, List, Dict, Any

# Whitelist of allowable session and customer history features
ALLOWED_SESSION_FEATURES = [
    'customer_segment', 'is_returning', 'previous_orders',
    'previous_abandonments', 'session_count', 'cart_value',
    'item_count', 'device', 'payment_method', 'shipping_cost',
    'time_on_checkout_min', 'product_views', 'coupon_views',
    'payment_attempts', 'payment_failed', 'technical_errors',
    'hour_of_day', 'day_of_week'
]

# Explicit blacklist of outcome fields that cause data leakage
QUARANTINED_OUTCOME_FIELDS = [
    'abandoned', 'abandonment_reason', 'recovered', 'recovery_channel',
    'recommended_action', 'recovered_revenue', 'intervention_cost',
    'discount_cost', 'recovered_profit', 'refund_amount',
    'return_completed', 'future_return', 'rto_completed', 'future_rto',
    'fraud_confirmed', 'post_intervention_status'
]

def assert_no_leakage(feature_cols: List[str]):
    """Raises ValueError if any outcome or target variable is in the feature list."""
    leaked = set(feature_cols).intersection(set(QUARANTINED_OUTCOME_FIELDS))
    if leaked:
        raise ValueError(f"CRITICAL ML ERROR: Data leakage detected! Features contain outcome fields: {leaked}")

def _get_series(df: pd.DataFrame, col: str, default, dtype):
    if col in df.columns:
        return df[col].astype(dtype)
    return pd.Series(default, index=df.index, dtype=dtype)


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Computes engineered e-commerce behavioral signals from session telemetry."""
    X = pd.DataFrame(index=df.index)

    # 1. Shipping friction
    cart_val = _get_series(df, 'cart_value', 1000.0, float).clip(lower=1.0)
    ship_cost = _get_series(df, 'shipping_cost', 0.0, float).clip(lower=0.0)
    X['shipping_ratio'] = ship_cost / cart_val
    X['high_shipping_flag'] = (X['shipping_ratio'] > 0.08).astype(int)

    # 2. Cart economics
    X['cart_value'] = cart_val
    item_cnt = _get_series(df, 'item_count', 1, int).clip(lower=1)
    X['item_count'] = item_cnt
    X['avg_item_price'] = cart_val / item_cnt
    X['high_value_cart'] = (cart_val >= 25000.0).astype(int)

    # 3. Friction & error scoring
    pay_attempts = _get_series(df, 'payment_attempts', 1, int)
    tech_errs = _get_series(df, 'technical_errors', 0, int)
    chk_time = _get_series(df, 'time_on_checkout_min', 3.0, float)
    pay_failed = _get_series(df, 'payment_failed', 0, int)

    X['payment_failed'] = pay_failed
    X['payment_attempts'] = pay_attempts
    X['technical_errors'] = tech_errs
    X['time_on_checkout_min'] = chk_time
    
    # Composite friction metric (normalized 0 to 5 scale)
    X['checkout_friction_score'] = np.clip(
        (pay_attempts * 0.3) + (tech_errs * 0.4) + (pay_failed * 0.8) + (chk_time / 15.0 * 0.2),
        0.0, 5.0
    )

    # 4. Loyalty & History
    prev_orders = _get_series(df, 'previous_orders', 1, int)
    prev_abandons = _get_series(df, 'previous_abandonments', 0, int)
    X['previous_orders'] = prev_orders
    X['previous_abandonments'] = prev_abandons
    X['is_returning'] = _get_series(df, 'is_returning', 0, int)
    X['customer_loyalty_score'] = (prev_orders * 0.7) - (prev_abandons * 0.3)

    # 5. Price sensitivity & engagement
    coupon_views = _get_series(df, 'coupon_views', 0, int)
    prod_views = _get_series(df, 'product_views', 1, int)
    sess_count = _get_series(df, 'session_count', 1, int)
    
    X['coupon_views'] = coupon_views
    X['product_views'] = prod_views
    X['session_count'] = sess_count
    X['price_sensitivity_score'] = (coupon_views * 0.5) + (X['shipping_ratio'] * 5.0)
    X['engagement_score'] = prod_views + (sess_count * 0.5)

    # 6. Temporal attributes
    hour_val = _get_series(df, 'hour_of_day', 12, int)
    day_val = _get_series(df, 'day_of_week', 2, int)
    X['hour_of_day'] = hour_val
    X['day_of_week'] = day_val
    X['is_weekend'] = (day_val >= 5).astype(int)

    # 7. One-hot encoded categoricals
    seg_series = _get_series(df, 'customer_segment', 'Regular', str)
    for seg in ['VIP', 'Regular', 'Occasional', 'New']:
        X[f'seg_{seg}'] = (seg_series == seg).astype(int)

    dev_series = _get_series(df, 'device', 'Mobile', str)
    for dev in ['Mobile', 'Desktop', 'Tablet']:
        X[f'dev_{dev}'] = (dev_series == dev).astype(int)

    pay_series = _get_series(df, 'payment_method', 'UPI', str)
    for pay in ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'COD', 'EMI']:
        safe_pay = pay.replace(" ", "_")
        X[f'pm_{safe_pay}'] = (pay_series == pay).astype(int)

    assert_no_leakage(list(X.columns))
    return X


def engineer_return_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extracts features for Return Risk prediction from order and catalog telemetry.
    Strict zero data leakage: operates exclusively on pre-fulfillment data.
    """
    X = pd.DataFrame(index=df.index)

    order_val = _get_series(df, 'order_value', 1000.0, float).clip(lower=1.0)
    X['order_value'] = order_val
    X['discount_percentage'] = _get_series(df, 'discount_percentage', 0.0, float)
    X['customer_return_rate'] = _get_series(df, 'customer_return_rate', 0.05, float)
    X['product_return_rate'] = _get_series(df, 'product_return_rate', 0.08, float)
    X['size_sensitive'] = _get_series(df, 'size_sensitive', False, int)
    X['previous_orders'] = _get_series(df, 'previous_orders', 1, int)

    # Category encoding
    cats = ['Fashion', 'Footwear', 'Electronics', 'Beauty', 'Home']
    cat_series = _get_series(df, 'category', '', str)
    for cat in cats:
        X[f'cat_{cat}'] = (cat_series == cat).astype(int)

    # Payment method encoding
    pay_series = _get_series(df, 'payment_method', '', str)
    for pay in ['UPI', 'Credit Card', 'Debit Card', 'COD']:
        X[f'pay_{pay}'] = (pay_series == pay).astype(int)

    # Region encoding
    reg_series = _get_series(df, 'shipping_address_region', '', str)
    for reg in ['North', 'South', 'West', 'East', 'Central']:
        X[f'reg_{reg}'] = (reg_series == reg).astype(int)

    assert_no_leakage(list(X.columns))
    return X


def engineer_rto_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extracts features for RTO (Return-To-Origin) risk prediction from shipment data.
    Strict zero data leakage: operates exclusively on pre-dispatch / in-transit signals.
    """
    X = pd.DataFrame(index=df.index)

    X['is_cod'] = _get_series(df, 'is_cod', 0, int)
    cod_amt = _get_series(df, 'cod_amount', 0.0, float)
    X['cod_amount'] = cod_amt
    X['order_value'] = _get_series(df, 'order_value', 1000.0, float).clip(lower=1.0)
    X['delivery_attempts'] = _get_series(df, 'delivery_attempts', 1, int)
    X['customer_return_rate'] = _get_series(df, 'customer_return_rate', 0.05, float)
    X['previous_orders'] = _get_series(df, 'previous_orders', 1, int)

    # Carrier encoding
    carr_series = _get_series(df, 'carrier', '', str)
    for carr in ['Bluedart', 'Delhivery', 'Shadowfax', 'Xpressbees']:
        X[f'carr_{carr}'] = (carr_series == carr).astype(int)

    # Region encoding
    reg_series = _get_series(df, 'destination_region', '', str)
    for reg in ['North', 'South', 'West', 'East', 'Central']:
        X[f'reg_{reg}'] = (reg_series == reg).astype(int)

    # Tier 2/3 pin code heuristic risk
    pincode_str = _get_series(df, 'destination_pincode', '110001', str)
    X['is_tier3_pincode'] = pincode_str.str.startswith(('8', '7', '46', '22', '45')).astype(int)

    assert_no_leakage(list(X.columns))
    return X


def engineer_fraud_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extracts features for Fraud & Anomaly detection.
    """
    X = pd.DataFrame(index=df.index)
    X['order_value'] = _get_series(df, 'order_value', 1000.0, float)
    X['is_cod'] = _get_series(df, 'is_cod', 0, int)
    X['lifetime_orders'] = _get_series(df, 'lifetime_orders', 1, int)
    X['cancellation_rate'] = _get_series(df, 'cancellation_rate', 0.0, float)
    X['return_rate'] = _get_series(df, 'return_rate', 0.0, float)
    X['payment_attempts'] = _get_series(df, 'payment_attempts', 1, int)

    assert_no_leakage(list(X.columns))
    return X
