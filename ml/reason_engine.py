"""
REVIVEAI DIAGNOSTIC REASON ENGINE (WITH QUANTITATIVE EVIDENCE)
Diagnoses the primary driver of checkout drop-off and pairs the diagnosis with
quantifiable evidence signals, metrics, and explanatory telemetry.
"""

from typing import Dict, Any, List

def diagnose_abandonment_reason(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates checkout friction signals and produces an evidentiary diagnosis.
    Returns:
        primary_reason (str): One of SHIPPING, PAYMENT, PRICE, TECHNICAL, HESITATION, TRUST
        confidence (float): 0.0 - 1.0
        evidence (List[str]): Bullet-point evidence signals with numerical metrics
        supporting_signals (Dict[str, Any]): Structured evidence metrics
        reason_scores (Dict[str, float]): Normalized scores across all reasons
    """
    cart_value = float(data.get('cart_value', 1000.0))
    shipping_cost = float(data.get('shipping_cost', 0.0))
    shipping_ratio = shipping_cost / max(cart_value, 1.0)
    payment_failed = bool(data.get('payment_failed', False))
    payment_attempts = int(data.get('payment_attempts', 1))
    technical_errors = int(data.get('technical_errors', 0))
    coupon_views = int(data.get('coupon_views', 0))
    time_on_checkout = float(data.get('time_on_checkout_min', 2.0))
    product_views = int(data.get('product_views', 3))
    is_returning = bool(data.get('is_returning', True))
    customer_segment = str(data.get('customer_segment', 'Regular'))

    scores = {
        'PAYMENT': 0.0,
        'TECHNICAL': 0.0,
        'SHIPPING': 0.0,
        'PRICE': 0.0,
        'HESITATION': 0.0,
        'TRUST': 0.0
    }
    evidence_map: Dict[str, List[str]] = {r: [] for r in scores}

    # 1. Payment Friction
    if payment_failed:
        scores['PAYMENT'] += 5.0
        evidence_map['PAYMENT'].append("Payment Gateway Failure flagged during transaction attempt")
    if payment_attempts >= 2:
        scores['PAYMENT'] += payment_attempts * 1.5
        evidence_map['PAYMENT'].append(f"Multiple payment attempts recorded: {payment_attempts} attempts")

    # 2. Technical Friction
    if technical_errors > 0:
        scores['TECHNICAL'] += technical_errors * 4.0
        evidence_map['TECHNICAL'].append(f"Client-side technical errors detected: {technical_errors} event(s)")

    # Explicit abandonment reason override/seed
    explicit_reason = data.get('abandonment_reason')
    if explicit_reason in scores:
        scores[explicit_reason] += 6.0
        evidence_map[explicit_reason].append(f"Explicit event telemetry flags root cause: {explicit_reason}")

    # 3. Shipping Friction
    if shipping_cost >= 500:
        scores['SHIPPING'] += 4.5
        evidence_map['SHIPPING'].append(f"High absolute delivery fee (Rs. {shipping_cost:,.0f}) flagged at checkout")
    elif shipping_ratio > 0.08:
        scores['SHIPPING'] += 4.5
        evidence_map['SHIPPING'].append(f"High shipping-to-cart ratio: {shipping_ratio*100:.1f}% of order value")
    elif shipping_ratio > 0.04:
        scores['SHIPPING'] += 2.0
        evidence_map['SHIPPING'].append(f"Shipping fee friction: Rs. {shipping_cost:,.0f} ({shipping_ratio*100:.1f}% ratio)")
    if shipping_cost >= 149 and cart_value < 3000:
        scores['SHIPPING'] += 2.5
        evidence_map['SHIPPING'].append(f"High absolute shipping cost (Rs. {shipping_cost:,.0f}) on sub-Rs. 3,000 cart")

    # 4. Price Sensitivity
    if coupon_views >= 3:
        scores['PRICE'] += 4.0
        evidence_map['PRICE'].append(f"Aggressive coupon code hunting: {coupon_views} coupon views")
    elif coupon_views >= 1:
        scores['PRICE'] += 1.5
        evidence_map['PRICE'].append(f"Discount code exploration: {coupon_views} view(s)")
    if cart_value > 30000 and customer_segment in ['Occasional', 'New']:
        scores['PRICE'] += 1.5
        evidence_map['PRICE'].append(f"Large order value threshold (Rs. {cart_value:,.0f}) with no applied discount")

    # 5. Hesitation / Indecision
    if time_on_checkout > 7.0 and not payment_failed and technical_errors == 0:
        scores['HESITATION'] += 3.5
        evidence_map['HESITATION'].append(f"Extended checkout dwell time: {time_on_checkout:.1f} minutes with no payment attempt")
    if product_views >= 8:
        scores['HESITATION'] += 1.5
        evidence_map['HESITATION'].append(f"Excessive comparison shopping: {product_views} product views before checkout")

    # 6. Trust & Security
    if not is_returning and cart_value > 15000 and customer_segment == 'New':
        scores['TRUST'] += 3.0
        evidence_map['TRUST'].append(f"First-time buyer with high order value (Rs. {cart_value:,.0f})")
    if data.get('payment_method') == 'COD' and cart_value > 10000:
        scores['TRUST'] += 1.5
        evidence_map['TRUST'].append("High-value order with Cash on Delivery preference")

    # Normalize scores
    total_score = sum(scores.values())
    if total_score == 0:
        primary_reason = 'HESITATION'
        confidence = 0.60
        normalized_scores = {k: round(1.0/len(scores), 2) for k in scores}
        evidence = ["Standard cart abandonment dwell time without recorded errors"]
    else:
        primary_reason = max(scores, key=scores.get)
        raw_top = scores[primary_reason]
        confidence = min(round(raw_top / total_score + 0.35, 2), 0.95)
        normalized_scores = {k: round(v / total_score, 3) for k, v in scores.items()}
        evidence = evidence_map[primary_reason]
        if not evidence:
            evidence = [f"Composite telemetry indicated {primary_reason.lower()} friction"]

    return {
        "primary_reason": primary_reason,
        "confidence": confidence,
        "evidence": evidence,
        "supporting_signals": {
            "shipping_ratio_pct": round(shipping_ratio * 100, 2),
            "cart_value": round(cart_value, 2),
            "shipping_cost": round(shipping_cost, 2),
            "payment_failed": payment_failed,
            "payment_attempts": payment_attempts,
            "technical_errors": technical_errors,
            "coupon_views": coupon_views,
            "time_on_checkout_min": round(time_on_checkout, 2)
        },
        "reason_scores": normalized_scores
    }
