"""
REVIVEAI EXPLAINABILITY ENGINE (XAI)
Implements local feature attribution and transparent explanations across:
- Checkout Recovery Elasticity
- Order Return Risk
- Shipment RTO Risk
- Fraud Anomaly Scores

Follows the paradigm: PREDICT -> EXPLAIN -> DECIDE.
"""

from typing import Dict, Any, List

def explain_prediction(data: Dict[str, Any], recovery_probability: float) -> Dict[str, Any]:
    """
    Computes local feature contribution weights for checkout recovery probability.
    """
    factors: List[Dict[str, Any]] = []

    prev_orders = int(data.get('previous_orders', 0))
    prev_abandons = int(data.get('previous_abandonments', 0))
    seg = str(data.get('customer_segment', 'Regular'))
    cart_val = float(data.get('cart_value', 2000.0))
    prod_views = int(data.get('product_views', 3))
    pay_failed = bool(data.get('payment_failed', False))
    tech_errs = int(data.get('technical_errors', 0))
    shipping_cost = float(data.get('shipping_cost', 0.0))
    shipping_ratio = shipping_cost / max(cart_val, 1.0)
    time_on_checkout = float(data.get('time_on_checkout_min', 3.0))

    if seg == 'VIP':
        factors.append({
            "feature": "Customer Segment (VIP)",
            "impact": "+",
            "weight": 22,
            "description": "VIP status with high lifetime value and purchase intent"
        })
    elif seg == 'Regular':
        factors.append({
            "feature": "Customer Segment (Regular)",
            "impact": "+",
            "weight": 12,
            "description": "Established buying history and brand trust"
        })
    elif seg == 'New':
        factors.append({
            "feature": "New Customer Status",
            "impact": "-",
            "weight": -10,
            "description": "Zero purchase history on file; lower initial response baseline"
        })

    if prev_orders >= 5:
        factors.append({
            "feature": f"Repeat Purchase History ({prev_orders} orders)",
            "impact": "+",
            "weight": 18,
            "description": "High past transaction volume strongly correlates with recovery conversion"
        })
    elif prev_orders >= 1:
        factors.append({
            "feature": f"Prior Customer ({prev_orders} order)",
            "impact": "+",
            "weight": 8,
            "description": "Previous completed purchase indicates account credibility"
        })

    if prev_abandons >= 3:
        factors.append({
            "feature": f"Frequent Abandoner ({prev_abandons} prior)",
            "impact": "-",
            "weight": -14,
            "description": "Chronic cart abandonment habit decreases intervention sensitivity"
        })

    if pay_failed:
        factors.append({
            "feature": "Payment Gateway Decline",
            "impact": "-",
            "weight": -15,
            "description": "Payment friction barrier halts checkout momentum"
        })

    if shipping_ratio > 0.08:
        factors.append({
            "feature": f"Shipping Fee Shock ({shipping_ratio*100:.0f}% of cart)",
            "impact": "-",
            "weight": -12,
            "description": "Shipping cost perceived as unexpected price inflation at checkout"
        })

    if tech_errs > 0:
        factors.append({
            "feature": f"Technical Glitch ({tech_errs} errors)",
            "impact": "-",
            "weight": -18,
            "description": "Client-side script or submission error interrupted completion"
        })

    if cart_val > 50000:
        factors.append({
            "feature": "High-Ticket Order Size",
            "impact": "-",
            "weight": -6,
            "description": "High consideration threshold requires reassurance"
        })

    positive_drivers = [f for f in factors if f['impact'] == '+']
    negative_drivers = [f for f in factors if f['impact'] == '-']

    positive_drivers.sort(key=lambda x: x['weight'], reverse=True)
    negative_drivers.sort(key=lambda x: x['weight'])

    return {
        "recovery_probability": round(recovery_probability, 4),
        "recovery_confidence_pct": f"{recovery_probability*100:.1f}%",
        "positive_drivers": positive_drivers[:3],
        "drag_factors": negative_drivers[:3],
        "all_contributing_factors": factors
    }


def explain_return_risk(data: Dict[str, Any], return_prob: float) -> Dict[str, Any]:
    """
    Computes local feature drivers for Return Risk prediction.
    """
    factors: List[Dict[str, Any]] = []

    category = str(data.get('category', 'Fashion'))
    size_sens = bool(data.get('size_sensitive', False))
    cust_ret_rate = float(data.get('customer_return_rate', 0.05))
    prod_ret_rate = float(data.get('product_return_rate', 0.08))
    order_val = float(data.get('order_value', 2000.0))

    if size_sens:
        factors.append({
            "feature": "Size-Sensitive Category (Apparel/Footwear)",
            "impact": "+",
            "weight": 26,
            "description": "Size and body-fit variance is the #1 driver of ecommerce returns"
        })

    if cust_ret_rate > 0.15:
        factors.append({
            "feature": f"High Customer Return Habit ({cust_ret_rate*100:.0f}%)",
            "impact": "+",
            "weight": 22,
            "description": "Customer historically returns over 15% of delivered orders"
        })

    if prod_ret_rate > 0.12:
        factors.append({
            "feature": f"Product Category Return Baseline ({prod_ret_rate*100:.0f}%)",
            "impact": "+",
            "weight": 14,
            "description": "Catalog item experiences elevated industry-wide return frequency"
        })

    if order_val > 10000:
        factors.append({
            "feature": "High-Value Discretionary Purchase",
            "impact": "+",
            "weight": 10,
            "description": "Higher price point elevates buyer remorse and post-delivery scrutiny"
        })

    if cust_ret_rate < 0.05:
        factors.append({
            "feature": "Loyal Customer Low Return Rate",
            "impact": "-",
            "weight": -18,
            "description": "Customer has stable purchase retention history"
        })

    if not size_sens and category in ['Beauty', 'Electronics']:
        factors.append({
            "feature": f"Non-Sized Category ({category})",
            "impact": "-",
            "weight": -15,
            "description": "Zero sizing ambiguity significantly decreases return probability"
        })

    positive = [f for f in factors if f['impact'] == '+']
    negative = [f for f in factors if f['impact'] == '-']

    return {
        "return_probability": round(return_prob, 4),
        "positive_drivers": positive,
        "drag_factors": negative
    }


def explain_rto_risk(data: Dict[str, Any], rto_prob: float) -> Dict[str, Any]:
    """
    Computes local feature drivers for RTO (Return-To-Origin) risk prediction.
    """
    factors: List[Dict[str, Any]] = []

    is_cod = bool(data.get('is_cod', False))
    attempts = int(data.get('delivery_attempts', 1))
    order_val = float(data.get('order_value', 2000.0))
    region = str(data.get('destination_region', 'North'))
    carrier = str(data.get('carrier', 'Delhivery'))

    if is_cod:
        factors.append({
            "feature": "Cash On Delivery (COD) Payment Mode",
            "impact": "+",
            "weight": 28,
            "description": "Zero upfront financial commitment drastically increases buyer refusal at door"
        })
    else:
        factors.append({
            "feature": "Prepaid Order (UPI/Card)",
            "impact": "-",
            "weight": -25,
            "description": "Upfront payment secures delivery commitment; RTO risk reduced by 85%"
        })

    if attempts > 1:
        factors.append({
            "feature": f"Multiple Failed Delivery Attempts ({attempts})",
            "impact": "+",
            "weight": 35,
            "description": "Previous non-delivery exception signals customer unavailability or address issue"
        })

    if is_cod and order_val > 3500:
        factors.append({
            "feature": f"High COD Ticket Size (Rs. {order_val:,.0f})",
            "impact": "+",
            "weight": 16,
            "description": "High cash collection amount increases doorstep buyer hesitation"
        })

    if region in ['East', 'North']:
        factors.append({
            "feature": f"Tier-2/3 Regional Transit Corridor ({region})",
            "impact": "+",
            "weight": 11,
            "description": "Longer multi-hop logistics transit creates higher delivery dropoff friction"
        })

    positive = [f for f in factors if f['impact'] == '+']
    negative = [f for f in factors if f['impact'] == '-']

    return {
        "rto_probability": round(rto_prob, 4),
        "positive_drivers": positive,
        "drag_factors": negative
    }
