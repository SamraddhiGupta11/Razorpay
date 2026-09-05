"""
REVIVEAI UNIFIED FINANCIAL IMPACT & DECISION ENGINE
Centralized economic optimization engine powering both RECOVER and PROTECT pillars:
- Checkout Abandonment Recovery
- Order Return Risk Prevention
- Shipment RTO (Return-To-Origin) Risk Mitigation
- Fraud & Behavioral Anomaly Triage

Calculates:
- Expected Revenue Recovered / Loss Prevented
- Direct Action Concession & Channel Delivery Costs
- Net Incremental Profit
- Program ROI %
- Side-by-side transparent matrix comparing candidate interventions.
"""

from typing import Dict, Any, List
from backend.app.config import settings

# Communication channel benchmark costs (INR)
CHANNEL_COSTS = {
    'EMAIL': 0.20,
    'SMS': 0.80,
    'WHATSAPP': 1.50,
    'AGENT_CALL': 35.00,
    'SYSTEM': 0.00
}

# Candidate action sets
RECOVERY_ACTIONS = [
    'NO_ACTION',
    'PERSONALIZED_REMINDER',
    'PAYMENT_ASSISTANCE',
    'FREE_SHIPPING',
    'DISCOUNT_5',
    'DISCOUNT_10',
    'TECH_SUPPORT',
    'VIP_CONCIERGE'
]

RETURN_PREVENTION_ACTIONS = [
    'STANDARD_FULFILLMENT',
    'SIZE_RECOMMENDATION',
    'PRODUCT_CLARIFICATION',
    'CUSTOMER_SUPPORT_CHECK',
    'VIP_PERSONAL_STYLING'
]

RTO_PREVENTION_ACTIONS = [
    'NO_ACTION',
    'DELIVERY_CONFIRMATION',
    'ADDRESS_VERIFICATION',
    'PAYMENT_PREPAID_REQUEST',
    'CUSTOMER_CALL',
    'LOGISTICS_ESCALATION'
]

FRAUD_ACTIONS = [
    'ALLOW',
    'MONITOR',
    'ENHANCED_VERIFICATION',
    'MANUAL_REVIEW'
]

def evaluate_next_best_action(
    cart_value: float,
    base_recovery_prob: float,
    reason: str,
    customer_segment: str = 'Regular',
    shipping_cost: float = 99.0,
    gross_margin: float = None
) -> Dict[str, Any]:
    """
    Simulates all recovery candidate interventions, calculates expected profit,
    and identifies the Next Best Action for dropped checkouts.
    """
    if gross_margin is None:
        gross_margin = settings.GROSS_MARGIN

    evaluated_options: List[Dict[str, Any]] = []

    for action in RECOVERY_ACTIONS:
        # Determine recommended channel for this action & segment
        if action == 'NO_ACTION':
            channel = 'EMAIL'
        elif action in ['PAYMENT_ASSISTANCE', 'TECH_SUPPORT']:
            channel = 'WHATSAPP' if customer_segment in ['VIP', 'Regular'] else 'SMS'
        elif action == 'FREE_SHIPPING':
            channel = 'WHATSAPP' if cart_value > 3000 else 'EMAIL'
        elif action == 'DISCOUNT_10':
            channel = 'EMAIL'
        elif action == 'DISCOUNT_5':
            channel = 'WHATSAPP' if customer_segment == 'VIP' else 'SMS'
        elif action == 'VIP_CONCIERGE':
            channel = 'WHATSAPP'
        elif customer_segment == 'VIP':
            channel = 'WHATSAPP'
        else:
            channel = 'EMAIL'

        channel_cost = 0.0 if action == 'NO_ACTION' else CHANNEL_COSTS.get(channel, 0.80)

        # Lift calculation
        lift = 0.0
        if action == 'NO_ACTION':
            lift = -0.15
        elif action == 'FREE_SHIPPING':
            lift = 0.52 if reason == 'SHIPPING' else 0.10
        elif action == 'PAYMENT_ASSISTANCE':
            lift = 0.52 if reason == 'PAYMENT' else 0.08
        elif action == 'TECH_SUPPORT':
            lift = 0.52 if reason == 'TECHNICAL' else 0.05
        elif action == 'DISCOUNT_5':
            lift = 0.28 if reason == 'PRICE' else 0.12
        elif action == 'DISCOUNT_10':
            lift = 0.35 if reason == 'PRICE' else 0.18
        elif action == 'PERSONALIZED_REMINDER':
            lift = 0.20
        elif action == 'VIP_CONCIERGE':
            lift = 0.30 if (customer_segment == 'VIP' and reason not in ['SHIPPING', 'PAYMENT', 'TECHNICAL']) else 0.05

        if channel == 'WHATSAPP':
            lift += 0.05
        elif channel == 'SMS':
            lift += 0.02

        conv_prob = min(max(base_recovery_prob + lift, 0.05), 0.95)

        # Direct discount cost
        if action == 'FREE_SHIPPING':
            discount_cost = float(shipping_cost)
        elif action == 'DISCOUNT_5':
            discount_cost = float(cart_value * 0.05)
        elif action == 'DISCOUNT_10':
            discount_cost = float(cart_value * 0.10)
        else:
            discount_cost = 0.0

        expected_revenue = cart_value * conv_prob
        expected_gross_profit = expected_revenue * gross_margin
        expected_discount_incurred = discount_cost * conv_prob
        total_expected_cost = channel_cost + expected_discount_incurred
        expected_profit = expected_gross_profit - total_expected_cost

        roi_pct = (expected_profit / max(total_expected_cost, 0.01)) * 100 if total_expected_cost > 0 else 0.0

        if action in ['PAYMENT_ASSISTANCE', 'TECH_SUPPORT']:
            timing = "Immediate (Within 10 mins)"
        elif action == 'FREE_SHIPPING':
            timing = "30 mins post-dropoff"
        elif customer_segment == 'VIP':
            timing = "1 hour post-dropoff (White-Glove)"
        else:
            timing = "3 hours post-dropoff (Optimal engagement window)"

        evaluated_options.append({
            "action": action,
            "channel": channel,
            "timing": timing,
            "expected_conversion_probability": round(conv_prob, 4),
            "expected_conversion_pct": f"{conv_prob*100:.1f}%",
            "expected_revenue": round(expected_revenue, 2),
            "discount_cost": round(discount_cost, 2),
            "channel_cost": round(channel_cost, 2),
            "total_expected_cost": round(total_expected_cost, 2),
            "expected_profit": round(expected_profit, 2),
            "roi_pct": round(roi_pct, 1)
        })

    best_action_opt = max(evaluated_options, key=lambda x: x['expected_profit'])
    explanation = (
        f"Selected {best_action_opt['action']} via {best_action_opt['channel']} because it delivers "
        f"the highest net expected profit of Rs. {best_action_opt['expected_profit']:,.2f} "
        f"with an expected conversion rate of {best_action_opt['expected_conversion_pct']} "
        f"(ROI: {best_action_opt['roi_pct']:.0f}%)."
    )

    return {
        "recommended_action": best_action_opt["action"],
        "channel": best_action_opt["channel"],
        "timing": best_action_opt["timing"],
        "expected_conversion_pct": best_action_opt["expected_conversion_pct"],
        "expected_revenue": best_action_opt["expected_revenue"],
        "expected_cost": best_action_opt["total_expected_cost"],
        "expected_profit": best_action_opt["expected_profit"],
        "roi_pct": best_action_opt["roi_pct"],
        "economic_rationale": explanation,
        "action_comparison_matrix": evaluated_options
    }

def evaluate_return_prevention_decision(
    order_value: float,
    return_probability: float,
    category: str = 'Fashion',
    size_sensitive: bool = True,
    customer_return_rate: float = 0.05
) -> Dict[str, Any]:
    """
    Evaluates actions to prevent costly e-commerce returns prior to dispatch.
    """
    base_return_loss = order_value * 0.35  # Logistics, inspection, restock depreciation
    expected_loss = base_return_loss * return_probability

    options: List[Dict[str, Any]] = []

    for action in RETURN_PREVENTION_ACTIONS:
        if action == 'STANDARD_FULFILLMENT':
            cost = 0.0
            reduction_factor = 0.0
            channel = 'SYSTEM'
        elif action == 'SIZE_RECOMMENDATION':
            cost = 1.50 # Automated WhatsApp fit prompt
            reduction_factor = 0.52 if size_sensitive else 0.15
            channel = 'WHATSAPP'
        elif action == 'PRODUCT_CLARIFICATION':
            cost = 0.80 # Email/SMS with detailed spec photos
            reduction_factor = 0.28
            channel = 'EMAIL'
        elif action == 'CUSTOMER_SUPPORT_CHECK':
            cost = 35.00 # Proactive verification call for high-ticket returners
            reduction_factor = 0.50
            channel = 'AGENT_CALL'
        elif action == 'VIP_PERSONAL_STYLING':
            cost = 75.00
            reduction_factor = 0.55
            channel = 'WHATSAPP'

        prevented_loss = expected_loss * reduction_factor
        net_impact = prevented_loss - cost
        roi = (net_impact / max(cost, 0.01)) * 100.0 if cost > 0 else 0.0

        options.append({
            "action": action,
            "channel": channel,
            "action_cost": round(cost, 2),
            "loss_reduction_pct": f"{reduction_factor*100:.0f}%",
            "prevented_loss": round(prevented_loss, 2),
            "expected_net_benefit": round(net_impact, 2),
            "roi_pct": round(roi, 1)
        })

    best_opt = max(options, key=lambda x: x['expected_net_benefit'])
    rationale = (
        f"Prescribed {best_opt['action']} via {best_opt['channel']} preventing estimated return losses of "
        f"Rs. {best_opt['prevented_loss']:,.2f} at a cost of Rs. {best_opt['action_cost']:.2f}, "
        f"delivering Rs. {best_opt['expected_net_benefit']:,.2f} net benefit (ROI: {best_opt['roi_pct']:.0f}%)."
    )

    return {
        "pillar": "PROTECT_RETURN",
        "order_value": order_value,
        "return_probability": round(return_probability, 4),
        "expected_gross_loss": round(expected_loss, 2),
        "recommended_action": best_opt["action"],
        "channel": best_opt["channel"],
        "action_cost": best_opt["action_cost"],
        "prevented_loss": best_opt["prevented_loss"],
        "expected_net_benefit": best_opt["expected_net_benefit"],
        "roi_pct": best_opt["roi_pct"],
        "rationale": rationale,
        "action_comparison_matrix": options
    }

def evaluate_rto_prevention_decision(
    order_value: float,
    rto_probability: float,
    is_cod: bool = True,
    delivery_attempts: int = 1
) -> Dict[str, Any]:
    """
    Evaluates actions to prevent Return-To-Origin (RTO) delivery failures.
    """
    # Two-way logistics fee + packaging waste
    base_rto_loss = (order_value * 0.18) + 150.0
    expected_loss = base_rto_loss * rto_probability

    options: List[Dict[str, Any]] = []

    for action in RTO_PREVENTION_ACTIONS:
        if action == 'NO_ACTION':
            cost = 0.0
            reduction_factor = 0.0
            channel = 'SYSTEM'
        elif action == 'DELIVERY_CONFIRMATION':
            cost = 1.50 # 1-tap WhatsApp slot confirm
            reduction_factor = 0.38
            channel = 'WHATSAPP'
        elif action == 'ADDRESS_VERIFICATION':
            cost = 2.00 # Automated pincode/landmark verification
            reduction_factor = 0.45
            channel = 'WHATSAPP'
        elif action == 'PAYMENT_PREPAID_REQUEST':
            cost = min(round(order_value * 0.05, 2), 75.0) # 5% cashback incentive to convert to UPI
            reduction_factor = 0.72 if is_cod else 0.20
            channel = 'WHATSAPP'
        elif action == 'CUSTOMER_CALL':
            cost = 35.00
            reduction_factor = 0.58
            channel = 'AGENT_CALL'
        elif action == 'LOGISTICS_ESCALATION':
            cost = 60.00 # Priority delivery attempt with courier supervisor
            reduction_factor = 0.50
            channel = 'SYSTEM'

        prevented_loss = expected_loss * reduction_factor
        net_impact = prevented_loss - cost
        roi = (net_impact / max(cost, 0.01)) * 100.0 if cost > 0 else 0.0

        options.append({
            "action": action,
            "channel": channel,
            "action_cost": round(cost, 2),
            "rto_reduction_pct": f"{reduction_factor*100:.0f}%",
            "prevented_loss": round(prevented_loss, 2),
            "expected_net_benefit": round(net_impact, 2),
            "roi_pct": round(roi, 1)
        })

    best_opt = max(options, key=lambda x: x['expected_net_benefit'])
    rationale = (
        f"Selected {best_opt['action']} via {best_opt['channel']} saving Rs. {best_opt['prevented_loss']:,.2f} "
        f"in reverse courier expenses for Rs. {best_opt['action_cost']:.2f} intervention cost "
        f"(Net benefit: Rs. {best_opt['expected_net_benefit']:,.2f}, ROI: {best_opt['roi_pct']:.0f}%)."
    )

    return {
        "pillar": "PROTECT_RTO",
        "order_value": order_value,
        "rto_probability": round(rto_probability, 4),
        "expected_gross_loss": round(expected_loss, 2),
        "recommended_action": best_opt["action"],
        "channel": best_opt["channel"],
        "action_cost": best_opt["action_cost"],
        "prevented_loss": best_opt["prevented_loss"],
        "expected_net_benefit": best_opt["expected_net_benefit"],
        "roi_pct": best_opt["roi_pct"],
        "rationale": rationale,
        "action_comparison_matrix": options
    }

def evaluate_fraud_triage_decision(
    order_value: float,
    fraud_score: float,
    signals: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    Evaluates proportionate fraud actions without discriminating legitimate buyers.
    """
    options: List[Dict[str, Any]] = []

    for action in FRAUD_ACTIONS:
        if action == 'ALLOW':
            cost = 0.0
            prevention = 0.0
        elif action == 'MONITOR':
            cost = 5.0 # Background telemetry logging
            prevention = order_value * 0.20 if fraud_score > 50 else 0.0
        elif action == 'ENHANCED_VERIFICATION':
            cost = 15.0 # Government ID / Aadhaar / OTP verification
            prevention = order_value * 0.85 if fraud_score > 60 else 0.0
        elif action == 'MANUAL_REVIEW':
            cost = 80.0 # Risk analyst review
            prevention = order_value * 0.95 if fraud_score > 75 else 0.0

        net_impact = prevention - cost
        options.append({
            "action": action,
            "cost": cost,
            "prevented_loss": round(prevention, 2),
            "expected_net_benefit": round(net_impact, 2)
        })

    if fraud_score >= 80.0:
        recommended = 'MANUAL_REVIEW'
        level = 'CRITICAL'
    elif fraud_score >= 60.0:
        recommended = 'ENHANCED_VERIFICATION'
        level = 'HIGH'
    elif fraud_score >= 35.0:
        recommended = 'MONITOR'
        level = 'MEDIUM'
    else:
        recommended = 'ALLOW'
        level = 'LOW'

    chosen_opt = next(o for o in options if o['action'] == recommended)

    return {
        "pillar": "PROTECT_FRAUD",
        "fraud_score": fraud_score,
        "risk_level": level,
        "recommended_action": recommended,
        "action_cost": chosen_opt["cost"],
        "prevented_loss": chosen_opt["prevented_loss"],
        "expected_net_benefit": chosen_opt["expected_net_benefit"],
        "signals": signals,
        "action_comparison_matrix": options
    }
