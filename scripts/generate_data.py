"""
REVIVEAI 100K SYNTHETIC DATASET GENERATOR
Generates 100,000 realistic checkout sessions with non-random behavioral relationships
and clean separation between pre-intervention session features and downstream outcomes.
"""

import os
import uuid
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_checkout_dataset(num_records=100000, output_path="data/checkout_records_100k.csv", seed=42):
    np.random.seed(seed)
    print(f"Generating {num_records:,} realistic checkout records...")

    # 1. Customers Generation (~40,000 unique customers for 100,000 checkouts)
    num_customers = int(num_records * 0.40)
    customer_ids = [f"CUST_{i+100000:06d}" for i in range(num_customers)]
    
    # Segment distribution: VIP (8%), Regular (32%), Occasional (35%), New (25%)
    segments = np.random.choice(['VIP', 'Regular', 'Occasional', 'New'], size=num_customers, p=[0.08, 0.32, 0.35, 0.25])
    
    # Customer historical attributes based on segment
    prev_orders = []
    prev_abandons = []
    is_returning_list = []
    for seg in segments:
        if seg == 'VIP':
            orders = np.random.randint(8, 35)
            abandons = np.random.randint(0, 4)
            returning = True
        elif seg == 'Regular':
            orders = np.random.randint(3, 10)
            abandons = np.random.randint(0, 5)
            returning = True
        elif seg == 'Occasional':
            orders = np.random.randint(1, 4)
            abandons = np.random.randint(0, 6)
            returning = np.random.choice([True, False], p=[0.7, 0.3])
        else: # New
            orders = 0
            abandons = 0
            returning = False
        prev_orders.append(orders)
        prev_abandons.append(abandons)
        is_returning_list.append(returning)

    customer_df = pd.DataFrame({
        'customer_id': customer_ids,
        'customer_segment': segments,
        'is_returning': is_returning_list,
        'previous_orders': prev_orders,
        'previous_abandonments': prev_abandons
    })

    # Sample customer assignments for 100,000 sessions (VIPs/Regulars have higher repeat sessions)
    weights = np.where(segments == 'VIP', 4.0, np.where(segments == 'Regular', 2.5, np.where(segments == 'Occasional', 1.2, 1.0)))
    weights /= weights.sum()
    chosen_customer_indices = np.random.choice(num_customers, size=num_records, p=weights)
    
    sess_customers = customer_df.iloc[chosen_customer_indices].reset_index(drop=True)

    # 2. Checkout Session Telemetry & Features
    checkout_ids = [f"CHK_{i+1000000:07d}" for i in range(num_records)]
    devices = np.random.choice(['Mobile', 'Desktop', 'Tablet'], size=num_records, p=[0.68, 0.26, 0.06])
    payment_methods = np.random.choice(['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'COD', 'EMI'], 
                                       size=num_records, p=[0.48, 0.22, 0.12, 0.08, 0.06, 0.04])
    
    # Cart Values: Pareto/Log-normal distribution tailored to Indian E-commerce (₹500 to ₹120,000)
    base_cart = np.random.lognormal(mean=7.8, sigma=1.0, size=num_records)
    cart_values = np.clip(base_cart, 499.0, 125000.0).round(2)
    
    # Item count correlated with cart value
    item_counts = np.clip(np.random.poisson(lam=1 + cart_values / 6000), 1, 15)
    
    # Shipping cost: Free for high value carts, otherwise flat or proportional
    shipping_costs = np.where(cart_values > 2500, 
                              np.random.choice([0.0, 99.0, 149.0], p=[0.65, 0.25, 0.10]),
                              np.random.choice([49.0, 99.0, 199.0, 299.0], p=[0.2, 0.5, 0.2, 0.1]))
    
    # Time spent on checkout (minutes)
    time_on_checkout = np.random.gamma(shape=2.5, scale=2.0, size=num_records).round(2)
    time_on_checkout = np.clip(time_on_checkout, 0.5, 30.0)
    
    # Product and Coupon views
    product_views = np.random.poisson(lam=4, size=num_records) + 1
    coupon_views = np.random.choice([0, 1, 2, 3, 4, 5], size=num_records, p=[0.55, 0.20, 0.12, 0.07, 0.04, 0.02])
    
    # Technical and payment friction
    payment_attempts = np.random.choice([1, 2, 3, 4], size=num_records, p=[0.82, 0.12, 0.04, 0.02])
    # Payment failure rate higher on multiple attempts or net banking
    fail_prob = np.where(payment_attempts > 1, 0.45, np.where(payment_methods == 'Net Banking', 0.12, 0.04))
    payment_failed = np.random.binomial(1, fail_prob) == 1
    
    # Technical errors (script freeze, gateway timeout)
    technical_errors = np.random.choice([0, 1, 2], size=num_records, p=[0.92, 0.06, 0.02])
    
    session_counts = np.clip(sess_customers['previous_orders'] + np.random.randint(1, 5, size=num_records), 1, 50)
    hour_p = np.array([
        0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.07,
        0.06, 0.06, 0.06, 0.06, 0.07, 0.08, 0.09, 0.08, 0.07, 0.04, 0.03, 0.01
    ], dtype=float)
    hour_p /= hour_p.sum()
    hours = np.random.choice(range(24), size=num_records, p=hour_p)
    days = np.random.choice(range(7), size=num_records)

    # 3. Ground Truth Abandonment Calculation (Realistic Behavioral Mechanics)
    shipping_ratio = shipping_costs / cart_values
    
    # Base risk by segment
    seg_risk = np.where(sess_customers['customer_segment'] == 'VIP', -0.30,
               np.where(sess_customers['customer_segment'] == 'Regular', -0.15,
               np.where(sess_customers['customer_segment'] == 'Occasional', 0.05, 0.20)))
    
    # Log-odds of abandonment based purely on pre-abandonment features
    z_abandon = (
        - 1.8                               # Base log-odds (~30% abandonment)
        + seg_risk
        + (shipping_ratio * 4.5)            # High shipping friction
        + (payment_failed * 2.5)            # Gateway decline
        + (technical_errors * 1.8)          # UI crash/timeout
        + (coupon_views * 0.25)             # Price comparison
        + (time_on_checkout * 0.08)         # Lingering hesitation
        - (sess_customers['previous_orders'] * 0.05)
        + (sess_customers['previous_abandonments'] * 0.10)
    )
    p_abandon = 1.0 / (1.0 + np.exp(-z_abandon))
    p_abandon = np.clip(p_abandon, 0.02, 0.98)
    abandoned = np.random.binomial(1, p_abandon)

    # 4. Abandonment Reason Assignment (Diagnostic Signals)
    reasons = []
    for i in range(num_records):
        if abandoned[i] == 0:
            reasons.append(None)
        else:
            if payment_failed[i] or payment_attempts[i] >= 3:
                reasons.append('PAYMENT')
            elif technical_errors[i] > 0:
                reasons.append('TECHNICAL')
            elif shipping_ratio[i] > 0.06 or (shipping_costs[i] >= 149 and cart_values[i] < 3000):
                reasons.append('SHIPPING')
            elif coupon_views[i] >= 2:
                reasons.append('PRICE')
            elif time_on_checkout[i] > 7.0:
                reasons.append('HESITATION')
            else:
                reasons.append(np.random.choice(['TRUST', 'HESITATION'], p=[0.4, 0.6]))

    # 5. Downstream Recovery, Action & Economics (STRICTLY QUARANTINED FROM INPUT FEATURES)
    recovered = np.zeros(num_records, dtype=int)
    recovery_channels = [None] * num_records
    recommended_actions = [None] * num_records
    recovered_revenues = np.zeros(num_records, dtype=float)
    intervention_costs = np.zeros(num_records, dtype=float)
    discount_costs = np.zeros(num_records, dtype=float)
    recovered_profits = np.zeros(num_records, dtype=float)
    gross_margin = 0.35 # 35% standard e-commerce margin

    # Channel cost benchmarks: Email ₹0.20, SMS ₹0.80, WhatsApp ₹1.50
    channel_costs = {'EMAIL': 0.20, 'SMS': 0.80, 'WHATSAPP': 1.50}

    for i in range(num_records):
        if abandoned[i] == 1:
            reason = reasons[i]
            seg = sess_customers['customer_segment'].iloc[i]
            cart = cart_values[i]
            
            # Select Next Best Action based on diagnosed root cause
            if reason == 'SHIPPING':
                action = 'FREE_SHIPPING'
                channel = 'WHATSAPP' if cart > 3000 else 'EMAIL'
                disc = shipping_costs[i]
                base_rec = 0.48
            elif reason == 'PAYMENT':
                action = 'PAYMENT_ASSISTANCE'
                channel = 'WHATSAPP' if seg in ['VIP', 'Regular'] else 'SMS'
                disc = 0.0
                base_rec = 0.52
            elif reason == 'PRICE':
                action = 'DISCOUNT_5' if cart < 15000 else 'DISCOUNT_10'
                channel = 'WHATSAPP' if seg == 'VIP' else 'EMAIL'
                disc = cart * (0.05 if action == 'DISCOUNT_5' else 0.10)
                base_rec = 0.44
            elif reason == 'TECHNICAL':
                action = 'TECH_SUPPORT'
                channel = 'SMS'
                disc = 0.0
                base_rec = 0.46
            elif seg == 'VIP':
                action = 'PERSONALIZED_REMINDER'
                channel = 'WHATSAPP'
                disc = 0.0
                base_rec = 0.58
            else:
                action = 'PERSONALIZED_REMINDER'
                channel = 'EMAIL'
                disc = 0.0
                base_rec = 0.28
                
            # Loyalty adjustment
            loyalty_boost = min(sess_customers['previous_orders'].iloc[i] * 0.03, 0.20)
            rec_prob = np.clip(base_rec + loyalty_boost - (sess_customers['previous_abandonments'].iloc[i] * 0.02), 0.10, 0.88)
            
            is_rec = np.random.binomial(1, rec_prob)
            int_cost = channel_costs[channel]
            
            recovered[i] = is_rec
            recovery_channels[i] = channel
            recommended_actions[i] = action
            intervention_costs[i] = int_cost
            discount_costs[i] = disc if is_rec else 0.0
            
            if is_rec == 1:
                rev = cart
                profit = (rev * gross_margin) - disc - int_cost
            else:
                rev = 0.0
                profit = - int_cost
                
            recovered_revenues[i] = round(rev, 2)
            recovered_profits[i] = round(profit, 2)

    # Assemble complete DataFrame
    df = pd.DataFrame({
        # Customer Profile
        'customer_id': sess_customers['customer_id'],
        'customer_segment': sess_customers['customer_segment'],
        'is_returning': sess_customers['is_returning'],
        'previous_orders': sess_customers['previous_orders'],
        'previous_abandonments': sess_customers['previous_abandonments'],
        'session_count': session_counts,
        # Session Attributes
        'checkout_id': checkout_ids,
        'cart_value': cart_values,
        'item_count': item_counts,
        'device': devices,
        'payment_method': payment_methods,
        'shipping_cost': shipping_costs,
        'time_on_checkout_min': time_on_checkout,
        'product_views': product_views,
        'coupon_views': coupon_views,
        'payment_attempts': payment_attempts,
        'payment_failed': payment_failed,
        'technical_errors': technical_errors,
        'hour_of_day': hours,
        'day_of_week': days,
        # Abandonment Target & Diagnostic Reason
        'abandoned': abandoned,
        'abandonment_reason': reasons,
        # Downstream Outcomes (Quarantined)
        'recovered': recovered,
        'recovery_channel': recovery_channels,
        'recommended_action': recommended_actions,
        'recovered_revenue': recovered_revenues,
        'intervention_cost': intervention_costs,
        'discount_cost': discount_costs,
        'recovered_profit': recovered_profits
    })

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Dataset successfully created at: {output_path}")
    print(f"Total checkouts: {len(df):,}")
    print(f"Abandoned checkouts: {df['abandoned'].sum():,} ({df['abandoned'].mean()*100:.1f}%)")
    print(f"Recovered checkouts: {df['recovered'].sum():,} ({df[df['abandoned']==1]['recovered'].mean()*100:.1f}%)")
    total_recovered_rev = df['recovered_revenue'].sum()
    print(f"Simulated Recovered Revenue: Rs. {total_recovered_rev/1e7:.2f} Cr")
    return df

if __name__ == "__main__":
    generate_checkout_dataset()
