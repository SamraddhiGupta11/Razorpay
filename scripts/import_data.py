"""
REVIVEAI HIGH-PERFORMANCE DATA IMPORTER
Reads checkout_records_100k.csv and bulk-loads data into PostgreSQL tables:
customers, checkout_sessions, abandoned_carts, interventions, and conversions.
"""

import os
import sys
import uuid
import psycopg2
from psycopg2.extras import execute_batch
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5433/payrevive")

def get_connection():
    return psycopg2.connect(DATABASE_URL)

def run_schema(conn):
    schema_path = os.path.join(os.path.dirname(__file__), "..", "database", "schema.sql")
    if os.path.exists(schema_path):
        with open(schema_path, "r") as f:
            sql = f.read()
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
        print("Database schema ensured.")

def import_dataset(csv_path="data/checkout_records_100k.csv", batch_size=5000):
    if not os.path.exists(csv_path):
        print(f"Dataset not found at {csv_path}. Please run generate_data.py first.")
        sys.exit(1)

    print(f"Reading {csv_path}...")
    df = pd.read_csv(csv_path)
    total_records = len(df)
    print(f"Loaded {total_records:,} records into memory.")

    conn = get_connection()
    run_schema(conn)

    cur = conn.cursor()
    base_time = datetime.now() - timedelta(days=30)

    # 1. Bulk insert customers
    print("Ingesting unique customers...")
    cust_df = df[['customer_id', 'customer_segment', 'is_returning', 'previous_orders', 'previous_abandonments']].drop_duplicates(subset=['customer_id'])
    
    cust_records = [
        (
            row.customer_id,
            row.customer_segment,
            bool(row.is_returning),
            int(row.previous_orders),
            int(row.previous_abandonments),
            base_time - timedelta(days=int(row.previous_orders * 5 + 10))
        )
        for row in cust_df.itertuples(index=False)
    ]
    
    cust_sql = """
    INSERT INTO customers (customer_id, customer_segment, is_returning, previous_orders, previous_abandonments, created_at)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (customer_id) DO NOTHING;
    """
    execute_batch(cur, cust_sql, cust_records, page_size=batch_size)
    conn.commit()
    print(f"Ingested {len(cust_records):,} customers.")

    # 2. Bulk insert checkout_sessions
    print("Ingesting checkout sessions...")
    checkout_records = []
    # Generate realistic timestamps spread over the last 30 days
    time_deltas = np_deltas = [
        timedelta(days=float(row.day_of_week) * 4 + (i % 4), hours=int(row.hour_of_day), minutes=int((i * 7) % 60))
        for i, row in enumerate(df[['day_of_week', 'hour_of_day']].itertuples(index=False))
    ]

    for i, row in enumerate(df.itertuples(index=False)):
        session_time = base_time + time_deltas[i]
        checkout_records.append((
            row.checkout_id,
            row.customer_id,
            float(row.cart_value),
            int(row.item_count),
            row.device,
            row.payment_method,
            float(row.shipping_cost),
            float(row.time_on_checkout_min),
            int(row.product_views),
            int(row.coupon_views),
            int(row.payment_attempts),
            bool(row.payment_failed),
            int(row.technical_errors),
            int(row.session_count),
            int(row.hour_of_day),
            int(row.day_of_week),
            session_time
        ))

    checkout_sql = """
    INSERT INTO checkout_sessions (
        checkout_id, customer_id, cart_value, item_count, device, payment_method,
        shipping_cost, time_on_checkout_min, product_views, coupon_views,
        payment_attempts, payment_failed, technical_errors, session_count,
        hour_of_day, day_of_week, started_at
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    execute_batch(cur, checkout_sql, checkout_records, page_size=batch_size)
    conn.commit()
    print(f"Ingested {len(checkout_records):,} checkout sessions.")

    # 3. Bulk insert abandoned_carts
    print("Ingesting abandoned carts...")
    abandoned_df = df[df['abandoned'] == 1].copy().reset_index(drop=True)
    abandoned_records = []
    cart_id_map = {}

    for i, row in enumerate(abandoned_df.itertuples(index=False)):
        cart_id = f"AC_{i+1000000:07d}"
        cart_id_map[row.checkout_id] = cart_id
        session_idx = int(row.checkout_id.split('_')[1]) - 1000000
        detected_time = base_time + time_deltas[session_idx] + timedelta(minutes=float(row.time_on_checkout_min))
        
        status = 'RECOVERED' if row.recovered == 1 else 'INTERVENED'
        
        # Approximate calibrated model probability outputs for DB records
        aban_prob = 0.75 + (0.15 if row.payment_failed else 0.05)
        rec_prob = 0.55 if row.recovered == 1 else 0.35

        abandoned_records.append((
            cart_id,
            row.checkout_id,
            row.abandonment_reason,
            round(min(aban_prob, 0.99), 4),
            round(rec_prob, 4),
            detected_time,
            status
        ))

    abandoned_sql = """
    INSERT INTO abandoned_carts (
        abandoned_cart_id, checkout_id, abandonment_reason,
        abandonment_probability, recovery_probability, detected_at, status
    ) VALUES (%s, %s, %s, %s, %s, %s, %s);
    """
    execute_batch(cur, abandoned_sql, abandoned_records, page_size=batch_size)
    conn.commit()
    print(f"Ingested {len(abandoned_records):,} abandoned carts.")

    # 4. Bulk insert interventions
    print("Ingesting interventions...")
    intervention_records = []
    intv_id_map = {}

    for i, row in enumerate(abandoned_df.itertuples(index=False)):
        intv_id = f"INT_{i+1000000:07d}"
        cart_id = cart_id_map[row.checkout_id]
        intv_id_map[row.checkout_id] = intv_id
        
        session_idx = int(row.checkout_id.split('_')[1]) - 1000000
        sent_time = base_time + time_deltas[session_idx] + timedelta(minutes=float(row.time_on_checkout_min) + 15)
        status = 'CONVERTED' if row.recovered == 1 else 'SENT'

        intervention_records.append((
            intv_id,
            cart_id,
            row.recovery_channel,
            row.recommended_action,
            sent_time - timedelta(minutes=5),
            sent_time,
            float(row.intervention_cost),
            float(row.discount_cost),
            status
        ))

    intervention_sql = """
    INSERT INTO interventions (
        intervention_id, abandoned_cart_id, channel, action,
        scheduled_at, sent_at, intervention_cost, discount_cost, status
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    execute_batch(cur, intervention_sql, intervention_records, page_size=batch_size)
    conn.commit()
    print(f"Ingested {len(intervention_records):,} interventions.")

    # 5. Bulk insert conversions
    print("Ingesting conversions...")
    converted_df = df[df['recovered'] == 1].copy().reset_index(drop=True)
    conversion_records = []

    for i, row in enumerate(converted_df.itertuples(index=False)):
        conv_id = f"CONV_{i+1000000:07d}"
        intv_id = intv_id_map[row.checkout_id]
        
        session_idx = int(row.checkout_id.split('_')[1]) - 1000000
        conv_time = base_time + time_deltas[session_idx] + timedelta(hours=2, minutes=10)

        conversion_records.append((
            conv_id,
            intv_id,
            row.customer_id,
            float(row.recovered_revenue),
            float(row.recovered_profit),
            conv_time
        ))

    conversion_sql = """
    INSERT INTO conversions (
        conversion_id, intervention_id, customer_id, order_value, recovered_profit, converted_at
    ) VALUES (%s, %s, %s, %s, %s, %s);
    """
    execute_batch(cur, conversion_sql, conversion_records, page_size=batch_size)
    conn.commit()
    print(f"Ingested {len(conversion_records):,} conversions.")

    # Dynamic summary queries
    cur.execute("SELECT COUNT(*) FROM checkout_sessions;")
    cnt_checkouts = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM abandoned_carts;")
    cnt_abandoned = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM conversions;")
    cnt_conversions = cur.fetchone()[0]

    cur.execute("SELECT COALESCE(SUM(order_value), 0) FROM conversions;")
    sum_recovered = cur.fetchone()[0]

    cur.execute("SELECT COALESCE(SUM(recovered_profit), 0) FROM conversions;")
    sum_profit = cur.fetchone()[0]

    print("\n" + "="*50)
    print("REVIVEAI DATA IMPORT SUMMARY")
    print("="*50)
    print(f"{cnt_checkouts:,} checkout records imported")
    print(f"{cnt_abandoned:,} abandoned checkouts ({cnt_abandoned/cnt_checkouts*100:.1f}%)")
    print(f"{cnt_conversions:,} recovered customers ({cnt_conversions/cnt_abandoned*100:.1f}%)")
    print(f"Rs. {float(sum_recovered)/1e7:.2f} Cr simulated recovered revenue")
    print(f"Rs. {float(sum_profit)/1e7:.2f} Cr simulated net profit")
    print("="*50 + "\n")

    cur.close()
    conn.close()

if __name__ == "__main__":
    import_dataset()
