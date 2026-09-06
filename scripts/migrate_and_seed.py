"""
REVIVEAI DATABASE MIGRATION & REALISTIC SYNTHETIC SEEDER
Idempotent, high-performance seeder for PostgreSQL:
- Applies versioned SQL migrations
- Enriches existing 100K customers with realistic names, locations, profiles
- Ingests 50 products across Fashion, Electronics, Beauty, Footwear, Home
- Seeds 15,000 historical orders with payment records
- Seeds 2,500 returns correlated with size sensitivity and product return rates
- Seeds 10,000 shipments with carrier telemetry & logistics events (NDR anomalies)
- Seeds 400 fraud events with multi-signal risk factors
- Seeds 3,500 customer reviews (English, Hindi, Hinglish) with aspect ratings
- Seeds customer suggestions & prioritized seller recommendations
- Seeds 8 canonical Judge Demo Scenarios
"""

import os
import sys
import random
import uuid
import json
import psycopg2
from psycopg2.extras import execute_batch, Json
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5433/payrevive")

# Set deterministic seed
random.seed(42)

def get_connection():
    return psycopg2.connect(DATABASE_URL)

def apply_migrations(conn):
    base_dir = os.path.dirname(__file__)
    mig_dir = os.path.join(base_dir, "..", "database", "migrations")
    for fname in sorted(os.listdir(mig_dir)):
        if fname.endswith(".sql"):
            fpath = os.path.join(mig_dir, fname)
            print(f"Applying migration: {fname}...")
            with open(fpath, "r", encoding="utf-8") as f:
                sql = f.read()
            with conn.cursor() as cur:
                cur.execute(sql)
            conn.commit()
    print("All migrations applied.")

# Realistic Indian demographic data pools
FIRST_NAMES = [
    "Aarav", "Aditi", "Aman", "Ananya", "Arjun", "Dev", "Diya", "Ishaan",
    "Kavya", "Meera", "Neha", "Pooja", "Pranav", "Priya", "Rahul", "Riya",
    "Rohan", "Sanjay", "Shreya", "Siddharth", "Sneha", "Tanvi", "Varun",
    "Vikram", "Karan", "Nisha", "Gaurav", "Simran", "Rajesh", "Sunita"
]
LAST_NAMES = [
    "Sharma", "Patel", "Verma", "Kumar", "Gupta", "Kapoor", "Singh",
    "Mishra", "Reddy", "Nair", "Choudhury", "Joshi", "Bose", "Das",
    "Mehta", "Iyer", "Deshmukh", "Chawla", "Malhotra", "Agarwal"
]
CITIES_REGIONS = [
    ("Mumbai", "West", "400001"),
    ("Delhi", "North", "110001"),
    ("Bengaluru", "South", "560001"),
    ("Hyderabad", "South", "500001"),
    ("Pune", "West", "411001"),
    ("Ahmedabad", "West", "380001"),
    ("Kolkata", "East", "700001"),
    ("Jaipur", "North", "302001"),
    ("Lucknow", "North", "226001"),
    ("Patna", "East", "800001"),
    ("Chandigarh", "North", "160001"),
    ("Indore", "Central", "452001"),
    ("Bhopal", "Central", "462001"),
    ("Kochi", "South", "682001"),
    ("Guwahati", "East", "781001")
]

PRODUCTS_CATALOG = [
    # Fashion (Size sensitive)
    ("PROD_FASH_01", "Slim Fit Premium Denim Jeans", "Fashion", 2499.00, 0.45, 0.65, 0.18, True, False),
    ("PROD_FASH_02", "Pure Banarasi Silk Saree", "Fashion", 8999.00, 0.50, 0.80, 0.12, False, False),
    ("PROD_FASH_03", "Oversized Cotton Graphic Hoodie", "Fashion", 1799.00, 0.40, 0.55, 0.15, True, False),
    ("PROD_FASH_04", "Formal Tailored Blazer", "Fashion", 5499.00, 0.48, 0.90, 0.22, True, False),
    ("PROD_FASH_05", "Embroidered Anarkali Kurta Set", "Fashion", 3999.00, 0.45, 0.70, 0.16, True, False),
    ("PROD_FASH_06", "Casual Linen Button-Down Shirt", "Fashion", 1999.00, 0.42, 0.35, 0.14, True, False),
    ("PROD_FASH_07", "Floral Print Summer Maxi Dress", "Fashion", 2299.00, 0.45, 0.40, 0.15, True, False),
    ("PROD_FASH_08", "Fleece Winter Bomber Jacket", "Fashion", 4299.00, 0.40, 0.95, 0.17, True, False),
    ("PROD_FASH_09", "Ethnic Nehru Jacket Khadi", "Fashion", 2799.00, 0.50, 0.45, 0.11, True, False),
    ("PROD_FASH_10", "Athletic Dri-Fit Joggers", "Fashion", 1499.00, 0.38, 0.40, 0.09, True, False),

    # Footwear (High size sensitivity)
    ("PROD_FOOT_01", "Pro-Cushion Running Sports Shoes", "Footwear", 3499.00, 0.40, 0.85, 0.24, True, False),
    ("PROD_FOOT_02", "Handcrafted Leather Formal Oxfords", "Footwear", 4999.00, 0.45, 0.95, 0.20, True, False),
    ("PROD_FOOT_03", "Breathable Slip-On Canvas Loafers", "Footwear", 1799.00, 0.38, 0.60, 0.16, True, False),
    ("PROD_FOOT_04", "Women Block Heel Ankle Strap Sandals", "Footwear", 2299.00, 0.42, 0.50, 0.25, True, False),
    ("PROD_FOOT_05", "Rugged Waterproof Hiking Boots", "Footwear", 5999.00, 0.44, 1.20, 0.18, True, False),
    ("PROD_FOOT_06", "Casual Chunky Sole Streetwear Sneakers", "Footwear", 2999.00, 0.40, 0.80, 0.22, True, False),

    # Electronics (High value, fragile, lower return rate)
    ("PROD_ELEC_01", "Active Noise Cancelling Wireless Headphones", "Electronics", 12999.00, 0.30, 0.45, 0.06, False, True),
    ("PROD_ELEC_02", "Smart Fitness AMOLED Smartwatch", "Electronics", 4999.00, 0.35, 0.15, 0.08, False, True),
    ("PROD_ELEC_03", "Portable Bluetooth Waterproof Speaker 20W", "Electronics", 2999.00, 0.32, 0.60, 0.05, False, False),
    ("PROD_ELEC_04", "Ultra-Slim 20000mAh 65W Power Bank", "Electronics", 2499.00, 0.28, 0.45, 0.04, False, False),
    ("PROD_ELEC_05", "4K Ultra-HD Mechanical Gaming Monitor 27-inch", "Electronics", 27999.00, 0.25, 4.80, 0.07, False, True),
    ("PROD_ELEC_06", "Ergonomic Backlit Wireless Keyboard & Mouse", "Electronics", 3499.00, 0.35, 0.80, 0.05, False, False),
    ("PROD_ELEC_07", "True Wireless Earbuds with Dual Mic ANC", "Electronics", 3999.00, 0.35, 0.08, 0.09, False, False),
    ("PROD_ELEC_08", "Smart Home HD Wi-Fi Security Camera 360", "Electronics", 2799.00, 0.30, 0.30, 0.06, False, True),
    ("PROD_ELEC_09", "Fast Multi-Device GaN Charger 100W", "Electronics", 3299.00, 0.32, 0.25, 0.03, False, False),
    ("PROD_ELEC_10", "Digital Drawing Graphic Tablet with Stylus", "Electronics", 6499.00, 0.28, 0.70, 0.06, False, True),

    # Beauty & Personal Care (Zero size sensitivity, low return, fragile packaging)
    ("PROD_BEAU_01", "Vitamin C & Hyaluronic Acid Face Serum", "Beauty", 899.00, 0.60, 0.12, 0.03, False, True),
    ("PROD_BEAU_02", "Organic Moroccan Argan Hair Treatment Oil", "Beauty", 1299.00, 0.55, 0.20, 0.04, False, True),
    ("PROD_BEAU_03", "Hydrating Gel Face Moisturizer SPF 50", "Beauty", 699.00, 0.58, 0.15, 0.02, False, False),
    ("PROD_BEAU_04", "Matte Long-Lasting Liquid Lipstick Set", "Beauty", 1199.00, 0.62, 0.10, 0.04, False, False),
    ("PROD_BEAU_05", "Deep Cleansing Charcoal Exfoliating Face Scrub", "Beauty", 549.00, 0.55, 0.18, 0.02, False, False),
    ("PROD_BEAU_06", "Luxury Oud Wood Eau De Parfum 100ml", "Beauty", 3499.00, 0.65, 0.35, 0.05, False, True),
    ("PROD_BEAU_07", "Ayurvedic Kumkumadi Radiance Night Cream", "Beauty", 1499.00, 0.58, 0.12, 0.03, False, True),
    ("PROD_BEAU_08", "Ionic Ceramic Hair Straightener Brush", "Beauty", 2199.00, 0.38, 0.50, 0.07, False, False),

    # Home & Kitchen (Fragile items, varied weight)
    ("PROD_HOME_01", "Smart True HEPA Air Purifier with AQI Display", "Home", 9999.00, 0.30, 4.20, 0.06, False, True),
    ("PROD_HOME_02", "Cast Iron Pre-Seasoned Dutch Oven 5L", "Home", 3299.00, 0.35, 4.50, 0.05, False, False),
    ("PROD_HOME_03", "Thread-Count 400 Egyptian Cotton Bed Sheet Set", "Home", 2499.00, 0.45, 1.10, 0.08, False, False),
    ("PROD_HOME_04", "Cold Press Slow Masticating Juicer 150W", "Home", 7499.00, 0.32, 3.80, 0.09, False, True),
    ("PROD_HOME_05", "Handmade Ceramic Dinner Set 18-Piece", "Home", 4299.00, 0.40, 6.00, 0.14, False, True),
    ("PROD_HOME_06", "Robot Vacuum Cleaner with Mopping LiDAR", "Home", 21999.00, 0.28, 5.20, 0.07, False, True),
    ("PROD_HOME_07", "Memory Foam Orthopedic Contour Pillow", "Home", 1899.00, 0.42, 0.90, 0.10, False, False),
    ("PROD_HOME_08", "Aroma Ultrasonic Essential Oil Diffuser", "Home", 1499.00, 0.48, 0.40, 0.04, False, True),
    ("PROD_HOME_09", "Stainless Steel Electric Gooseneck Kettle", "Home", 2799.00, 0.35, 1.10, 0.05, False, False),
    ("PROD_HOME_10", "Dimmable LED Smart Desk Lamp with Wireless Qi", "Home", 2199.00, 0.36, 0.85, 0.05, False, True),
]

def seed_products(conn):
    print("Seeding products catalog...")
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM products;")
    cnt = cur.fetchone()[0]
    if cnt >= len(PRODUCTS_CATALOG):
        print(f"Products already populated ({cnt} items).")
        return

    insert_query = """
    INSERT INTO products (product_id, product_name, category, price, margin, weight_kg, return_rate, size_sensitive, fragile)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (product_id) DO NOTHING;
    """
    execute_batch(cur, insert_query, PRODUCTS_CATALOG)
    conn.commit()
    print(f"Seeded {len(PRODUCTS_CATALOG)} products.")

def enrich_customers(conn):
    print("Enriching customer demographic and risk profiles...")
    cur = conn.cursor()
    cur.execute("SELECT customer_id, customer_segment, previous_orders FROM customers;")
    rows = cur.fetchall()
    print(f"Found {len(rows)} customer records to enrich.")

    # Canonical demo customers to inject or update explicitly
    demo_customers = [
        ("DEMO_CUST_RAHUL", "Rahul Sharma", "rahul.sharma@example.in", "+91 98201 12345", "Mumbai", "VIP", 12, 16, 142000.0, 11833.0, 0.08, 0.00, "Credit Card", "WHATSAPP"),
        ("DEMO_CUST_PRIYA", "Priya Patel", "priya.patel@example.in", "+91 98450 67890", "Bengaluru", "Regular", 6, 8, 68000.0, 11333.0, 0.05, 0.02, "UPI", "WHATSAPP"),
        ("DEMO_CUST_AMAN", "Aman Verma", "aman.verma@example.in", "+91 98110 54321", "Delhi", "Occasional", 3, 4, 24000.0, 8000.0, 0.02, 0.05, "UPI", "SMS"),
        ("DEMO_CUST_RAVI", "Ravi Kumar", "ravi.kumar@example.in", "+91 98480 98765", "Hyderabad", "Regular", 5, 7, 45000.0, 9000.0, 0.04, 0.01, "Debit Card", "SMS"),
        ("DEMO_CUST_NEHA", "Neha Gupta", "neha.gupta@example.in", "+91 98200 11223", "Mumbai", "VIP", 18, 22, 280000.0, 15555.0, 0.05, 0.00, "Credit Card", "WHATSAPP"),
        ("DEMO_CUST_MEERA", "Meera Kapoor", "meera.kapoor@example.in", "+91 98900 44556", "Pune", "Regular", 7, 9, 52000.0, 7428.0, 0.28, 0.02, "UPI", "WHATSAPP"), # High return risk!
        ("DEMO_CUST_VIKRAM", "Vikram Singh", "vikram.singh@example.in", "+91 94310 77889", "Patna", "Occasional", 2, 3, 9500.0, 4750.0, 0.10, 0.35, "COD", "WHATSAPP"), # High RTO risk!
        ("DEMO_CUST_POOJA", "Pooja Mishra", "pooja.mishra@example.in", "+91 94150 99887", "Lucknow", "New", 1, 1, 3500.0, 3500.0, 0.00, 0.00, "UPI", "EMAIL")
    ]

    # Insert or update demo customers
    demo_upsert = """
    INSERT INTO customers (customer_id, name, email, phone, location, customer_segment, previous_orders, lifetime_orders, lifetime_value, average_order_value, return_rate, cancellation_rate, preferred_payment_method, preferred_channel)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (customer_id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        location = EXCLUDED.location,
        customer_segment = EXCLUDED.customer_segment,
        previous_orders = EXCLUDED.previous_orders,
        lifetime_orders = EXCLUDED.lifetime_orders,
        lifetime_value = EXCLUDED.lifetime_value,
        average_order_value = EXCLUDED.average_order_value,
        return_rate = EXCLUDED.return_rate,
        cancellation_rate = EXCLUDED.cancellation_rate,
        preferred_payment_method = EXCLUDED.preferred_payment_method,
        preferred_channel = EXCLUDED.preferred_channel;
    """
    execute_batch(cur, demo_upsert, demo_customers)

    # Batch update existing customers
    update_records = []
    for cid, seg, prev_ord in rows:
        fn = random.choice(FIRST_NAMES)
        ln = random.choice(LAST_NAMES)
        name = f"{fn} {ln}"
        email = f"{fn.lower()}.{ln.lower()}{random.randint(10,999)}@gmail.com"
        phone = f"+91 {random.randint(70,99)}{random.randint(10,99)} {random.randint(10000,99999)}"
        city, reg, _ = random.choice(CITIES_REGIONS)
        
        lt_orders = prev_ord + random.randint(1, 5)
        aov = random.choice([1500, 2500, 3800, 6500, 12000, 24000])
        ltv = lt_orders * aov
        ret_rate = round(random.betavariate(1.5, 10.0), 4)
        canc_rate = round(random.betavariate(1.0, 15.0), 4)
        pref_pay = random.choice(['UPI', 'UPI', 'Credit Card', 'Debit Card', 'COD', 'Net Banking'])
        pref_chan = 'WHATSAPP' if seg in ['VIP', 'Regular'] else random.choice(['SMS', 'EMAIL'])

        update_records.append((name, email, phone, city, lt_orders, ltv, aov, ret_rate, canc_rate, pref_pay, pref_chan, cid))

    update_query = """
    UPDATE customers SET
        name = %s,
        email = %s,
        phone = %s,
        location = %s,
        lifetime_orders = %s,
        lifetime_value = %s,
        average_order_value = %s,
        return_rate = %s,
        cancellation_rate = %s,
        preferred_payment_method = %s,
        preferred_channel = %s
    WHERE customer_id = %s;
    """
    execute_batch(cur, update_query, update_records, page_size=2000)
    conn.commit()
    print("Customer demographic and risk profiles updated.")

def seed_orders_returns_shipments(conn, target_orders=15000):
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM orders;")
    existing_orders = cur.fetchone()[0]
    if existing_orders >= target_orders:
        print(f"Orders already seeded ({existing_orders} orders). Skipping order generation.")
        return

    print(f"Generating and seeding {target_orders} realistic orders, returns, shipments, and logistics events...")
    cur.execute("SELECT customer_id, location, customer_segment, return_rate, preferred_payment_method FROM customers LIMIT 20000;")
    customers = cur.fetchall()
    
    cur.execute("SELECT product_id, price, category, size_sensitive, return_rate FROM products;")
    products = cur.fetchall()

    base_date = datetime.now() - timedelta(days=90)

    orders_data = []
    payments_data = []
    returns_data = []
    shipments_data = []
    logistics_events_data = []
    rto_scores_data = []
    return_scores_data = []

    carriers = ['Bluedart', 'Delhivery', 'Shadowfax', 'Xpressbees']
    origin_hubs = ['BHIWANDI_HUB_01', 'GURGAON_HUB_03', 'WHITEFIELD_HUB_02', 'KOLKATA_HUB_01']

    for i in range(target_orders):
        oid = f"ORD_{100000 + i}"
        cust = random.choice(customers)
        cid, cloc, cseg, cret_rate, cpay = cust
        prod = random.choice(products)
        pid, pprice, pcat, psize_sens, pret_rate = prod

        # Correlated order value
        val = float(pprice)
        disc_pct = random.choice([0.0, 0.0, 5.0, 10.0, 15.0])
        order_val = round(val * (1.0 - (disc_pct / 100.0)), 2)
        
        # Payment method: COD higher in tier 2/3 cities, UPI dominant in metros
        if cloc in ['Patna', 'Lucknow', 'Bhopal', 'Guwahati']:
            pay_method = random.choice(['COD', 'COD', 'UPI', 'Debit Card'])
        else:
            pay_method = random.choice(['UPI', 'UPI', 'Credit Card', 'Debit Card', 'COD'])

        # Shipping region & pincode
        _, region, pincode = next((item for item in CITIES_REGIONS if item[0] == cloc), ("Delhi", "North", "110001"))

        # Order timestamp
        days_ago = random.uniform(1, 85)
        ord_time = base_date + timedelta(days=days_ago, hours=random.randint(8, 22), minutes=random.randint(0, 59))

        # Status: most delivered
        ord_status = random.choices(['DELIVERED', 'RETURNED', 'RTO', 'IN_TRANSIT', 'CANCELLED'], weights=[0.75, 0.12, 0.06, 0.05, 0.02])[0]

        orders_data.append((oid, cid, pid, order_val, disc_pct, pay_method, 'COMPLETED', ord_status, region, pincode, ord_time))

        # Payments table entry
        pay_id = f"PAY_{100000 + i}"
        payments_data.append((pay_id, oid, order_val, pay_method, 'Razorpay', 'SUCCESS', None, ord_time))

        # Shipments table entry
        ship_id = f"SHIP_{100000 + i}"
        carrier = random.choice(carriers)
        tracking = f"TRK{random.randint(10000000, 99999999)}"
        hub = random.choice(origin_hubs)
        is_cod = (pay_method == 'COD')
        cod_amount = order_val if is_cod else 0.0
        attempts = 1
        if ord_status == 'RTO':
            attempts = random.choice([2, 3])
        elif ord_status == 'DELIVERED':
            attempts = random.choices([1, 2], weights=[0.85, 0.15])[0]

        ship_status = 'DELIVERED' if ord_status == 'DELIVERED' else ('RETURNED_TO_ORIGIN' if ord_status == 'RTO' else 'IN_TRANSIT')
        shipments_data.append((ship_id, oid, carrier, tracking, hub, region, pincode, is_cod, cod_amount, ship_status, attempts, ord_time + timedelta(hours=4)))

        # RTO Risk calculation & scores
        # Correlated: COD + higher order value + East/North tier-3 + multiple attempts -> higher RTO
        rto_prob = 0.04
        rto_reasons = []
        if is_cod:
            rto_prob += 0.14
            rto_reasons.append("Payment mode COD")
        if region in ['East', 'North'] and pincode.startswith(('8', '2')):
            rto_prob += 0.09
            rto_reasons.append("High-friction regional delivery corridor")
        if order_val > 4000 and is_cod:
            rto_prob += 0.12
            rto_reasons.append("High-ticket COD refusal vulnerability")
        if attempts > 1:
            rto_prob += 0.25
            rto_reasons.append("Multiple failed delivery rescheduling events")
        
        rto_prob = min(max(rto_prob + random.uniform(-0.03, 0.04), 0.01), 0.95)
        rto_level = 'HIGH' if rto_prob >= 0.35 else ('MEDIUM' if rto_prob >= 0.15 else 'LOW')
        rto_loss = round(order_val * 0.18 + 150.0, 2) # Reverse logistics + packaging waste
        rto_act = 'DELIVERY_CONFIRMATION' if rto_level == 'MEDIUM' else ('PAYMENT_PREPAID_REQUEST' if is_cod and rto_level == 'HIGH' else 'NO_ACTION')

        rto_scores_data.append((f"RTO_RSK_{100000+i}", ship_id, round(rto_prob, 4), rto_level, Json(rto_reasons), rto_loss, rto_act, 'PENDING', ord_time + timedelta(hours=6)))

        # Logistics Events & Anomaly generation
        if ord_status == 'RTO' or random.random() < 0.08:
            ev_id = f"EV_{100000+i}"
            if ord_status == 'RTO':
                anom_type = 'NDR_FAKE_ATTEMPT' if random.random() < 0.60 else 'UNEXPECTED_DELAY'
                risk_class = 'LOGISTICS_RISK' if anom_type == 'NDR_FAKE_ATTEMPT' else 'CUSTOMER_RISK'
                desc = f"NDR raised: Customer unreachable via voice call on delivery attempt {attempts}."
                delay = random.uniform(24.0, 72.0)
            else:
                anom_type = 'WEIGHT_MISMATCH' if random.random() < 0.3 else 'UNEXPECTED_DELAY'
                risk_class = 'OPERATIONAL_ANOMALY'
                desc = f"Transit delay flagged at {hub}: Carrier sorting backlog exceeded 24h SLA."
                delay = random.uniform(12.0, 36.0)

            logistics_events_data.append((ev_id, ship_id, 'OUT_FOR_DELIVERY', 'EXCEPTION', cloc, round(delay, 1), True, anom_type, risk_class, desc, ord_time + timedelta(days=2)))

        # Return Risk Scores & Returns generation
        # Correlated: Fashion + Size sensitive + customer return rate -> high return probability
        ret_prob = float(pret_rate) * 1.5 + float(cret_rate) * 1.2
        ret_reasons = []
        if psize_sens:
            ret_prob += 0.12
            ret_reasons.append("Size/Fit sensitive product category")
        if pcat == 'Fashion':
            ret_reasons.append("Apparel color/fabric expectation sensitivity")
        if float(cret_rate) > 0.15:
            ret_prob += 0.15
            ret_reasons.append("Customer has frequent return history (>15%)")
        
        ret_prob = min(max(ret_prob + random.uniform(-0.04, 0.05), 0.02), 0.95)
        ret_level = 'HIGH' if ret_prob >= 0.30 else ('MEDIUM' if ret_prob >= 0.15 else 'LOW')
        exp_loss = round(order_val * 0.35, 2)
        rec_act = 'SIZE_RECOMMENDATION' if psize_sens and ret_level == 'HIGH' else ('PRODUCT_CLARIFICATION' if ret_level == 'MEDIUM' else 'STANDARD_FULFILLMENT')

        return_scores_data.append((f"RET_RSK_{100000+i}", oid, round(ret_prob, 4), ret_level, Json(ret_reasons), exp_loss, rec_act, 'RECOMMENDED', ord_time + timedelta(hours=2)))

        # If order was returned, record in returns table
        if ord_status == 'RETURNED':
            ret_id = f"RET_{100000 + i}"
            reason = "SIZE_MISMATCH" if psize_sens else random.choice(["PRODUCT_DEFECT", "QUALITY_ISSUE", "NOT_AS_PICTURED", "DELAYED_DELIVERY"])
            returns_data.append((ret_id, oid, cid, pid, reason, 'APPROVED', order_val, ord_time + timedelta(days=random.randint(3, 7))))

    # Batch inserts
    print(f"Bulk inserting {len(orders_data)} orders...")
    execute_batch(cur, "INSERT INTO orders VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (order_id) DO NOTHING;", orders_data, page_size=2500)

    print(f"Bulk inserting {len(payments_data)} payments...")
    execute_batch(cur, "INSERT INTO payments VALUES (%s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (payment_id) DO NOTHING;", payments_data, page_size=2500)

    print(f"Bulk inserting {len(shipments_data)} shipments...")
    execute_batch(cur, "INSERT INTO shipments VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (shipment_id) DO NOTHING;", shipments_data, page_size=2500)

    print(f"Bulk inserting {len(rto_scores_data)} RTO risk scores...")
    execute_batch(cur, "INSERT INTO rto_risk_scores VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (risk_id) DO NOTHING;", rto_scores_data, page_size=2500)

    print(f"Bulk inserting {len(return_scores_data)} Return risk scores...")
    execute_batch(cur, "INSERT INTO return_risk_scores VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (risk_id) DO NOTHING;", return_scores_data, page_size=2500)

    print(f"Bulk inserting {len(returns_data)} returns...")
    execute_batch(cur, "INSERT INTO returns VALUES (%s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (return_id) DO NOTHING;", returns_data, page_size=2500)

    print(f"Bulk inserting {len(logistics_events_data)} logistics events...")
    execute_batch(cur, "INSERT INTO logistics_events VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (event_id) DO NOTHING;", logistics_events_data, page_size=2500)

    conn.commit()
    print("Orders, Shipments, Returns, and Logistics Events successfully seeded.")

def seed_fraud_events(conn, target_fraud=400):
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM fraud_events;")
    if cur.fetchone()[0] >= target_fraud:
        print("Fraud events already seeded.")
        return

    print(f"Seeding {target_fraud} fraud anomaly detection records...")
    cur.execute("SELECT customer_id FROM customers LIMIT 5000;")
    cids = [r[0] for r in cur.fetchall()]

    fraud_records = []
    actions = ['ALLOW', 'MONITOR', 'MANUAL_REVIEW', 'ENHANCED_VERIFICATION']

    signal_types = [
        {"type": "ADDRESS_CLUSTERING", "desc": "5 distinct customer accounts sharing identical physical delivery address."},
        {"type": "VELOCITY_SPIKE", "desc": "4 high-value orders placed in under 12 minutes from previously idle account."},
        {"type": "COD_REFUSAL_PATTERN", "desc": "Customer COD refusal rate exceeds 65% across last 6 dispatch attempts."},
        {"type": "REPEATED_REFUND_CLAIM", "desc": "Consecutive empty-box claims submitted without return courier handover."},
        {"type": "PACKAGE_WEIGHT_TAMPER", "desc": "Return package weight recorded 450g less than outbound dispatch manifest."}
    ]

    for i in range(target_fraud):
        fid = f"FRD_{1000 + i}"
        cid = random.choice(cids)
        score = round(random.betavariate(2.0, 3.0) * 100.0, 1)
        
        if score > 80.0:
            level = 'ENHANCED_VERIFICATION'
            act = 'ENHANCED_VERIFICATION'
        elif score > 60.0:
            level = 'MANUAL_REVIEW'
            act = 'MANUAL_REVIEW'
        elif score > 35.0:
            level = 'MONITOR'
            act = 'MONITOR'
        else:
            level = 'LOW_RISK'
            act = 'ALLOW'

        sig = random.sample(signal_types, k=random.randint(1, 2))
        fraud_records.append((fid, cid, None, score, level, Json(sig), act, 'OPEN', datetime.now() - timedelta(days=random.randint(1, 45))))

    insert_sql = "INSERT INTO fraud_events VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (fraud_id) DO NOTHING;"
    execute_batch(cur, insert_sql, fraud_records)
    conn.commit()
    print(f"Seeded {len(fraud_records)} fraud anomaly records.")

# Customer reviews pool in English, Hindi, and Hinglish
SAMPLE_REVIEWS = [
    # English & Mixed (Quality, Delivery, Size, Packaging, Payment)
    ("The fabric quality is fantastic, fits like a glove! Delivery took only 2 days. Very satisfied.", 5, "English", "POSITIVE", 0.92, ["Good Quality", "Fast Delivery"], [("QUALITY", "POSITIVE", "fabric quality is fantastic"), ("FIT", "POSITIVE", "fits like a glove"), ("DELIVERY", "POSITIVE", "took only 2 days")]),
    ("Product accha hai but delivery bahut late thi! 6 din lag gaye pahunchne mein.", 2, "Hinglish", "NEGATIVE", -0.58, ["Late Delivery"], [("QUALITY", "POSITIVE", "Product accha hai"), ("DELIVERY", "NEGATIVE", "delivery bahut late thi, 6 din lag gaye")]),
    ("Size was way smaller than described in size chart. Had to return it immediately. Please fix sizing!", 1, "English", "NEGATIVE", -0.85, ["Wrong Size"], [("SIZE", "NEGATIVE", "way smaller than described in size chart"), ("RETURN_PROCESS", "NEGATIVE", "Had to return it immediately")]),
    ("Bohot bekar packaging thi, box pura dab gaya tha. But fortunately product andar intact tha.", 3, "Hinglish", "NEUTRAL", -0.15, ["Poor Packaging"], [("PACKAGING", "NEGATIVE", "Bohot bekar packaging thi, box pura dab gaya"), ("QUALITY", "POSITIVE", "product andar intact tha")]),
    ("UPI payment failed two times on checkout, money got deducted but order did not show. Support helped resolve.", 2, "English", "NEGATIVE", -0.65, ["Payment Issue"], [("PAYMENT", "NEGATIVE", "UPI payment failed two times on checkout"), ("CUSTOMER_SUPPORT", "POSITIVE", "Support helped resolve")]),
    ("Pure silk material, looks exactly as pictured. Superb finish and elegant embroidery.", 5, "English", "POSITIVE", 0.95, ["Good Quality", "True to Picture"], [("QUALITY", "POSITIVE", "Pure silk material, looks exactly as pictured"), ("PRODUCT_DESCRIPTION", "POSITIVE", "looks exactly as pictured")]),
    ("Kharab product quality! Stitching khul gayi pehle wash mein hi. Total waste of money.", 1, "Hinglish", "NEGATIVE", -0.90, ["Poor Quality"], [("QUALITY", "NEGATIVE", "Kharab product quality, Stitching khul gayi pehle wash mein"), ("PRICE", "NEGATIVE", "Total waste of money")]),
    ("Bahut hi badhiya shoes hain, running ke liye perfect grip aur lightweight comfort.", 5, "Hindi", "POSITIVE", 0.88, ["Good Quality", "Comfortable"], [("QUALITY", "POSITIVE", "running ke liye perfect grip aur lightweight comfort"), ("FIT", "POSITIVE", "perfect grip")]),
    ("Delivery partner marked customer unavailable without even calling me! Fake NDR attempt!", 1, "English", "NEGATIVE", -0.88, ["Fake NDR", "Delivery Delay"], [("DELIVERY", "NEGATIVE", "marked customer unavailable without even calling me")]),
    ("Sound quality is clear and crisp, ANC blocks metro noise easily. Great battery backup too.", 5, "English", "POSITIVE", 0.91, ["Great ANC", "Value for Money"], [("QUALITY", "POSITIVE", "Sound quality is clear and crisp, ANC blocks metro noise"), ("PRICE", "POSITIVE", "Great value")]),
    ("Order cancel karne ka process bahut difficult hai. Return policy clear nahi hai website pe.", 2, "Hinglish", "NEGATIVE", -0.70, ["Difficult Return"], [("RETURN_PROCESS", "NEGATIVE", "cancel karne ka process bahut difficult hai"), ("CUSTOMER_SUPPORT", "NEGATIVE", "Return policy clear nahi hai")]),
    ("Color matches photos, fabric is soft and breathable. Size L fits perfectly.", 5, "English", "POSITIVE", 0.85, ["Perfect Fit", "True to Picture"], [("FIT", "POSITIVE", "Size L fits perfectly"), ("QUALITY", "POSITIVE", "fabric is soft and breathable")]),
    ("Courier delayed by 4 days with no tracking updates. Customer care gave generic script answers.", 1, "English", "NEGATIVE", -0.82, ["Poor Support", "Late Delivery"], [("DELIVERY", "NEGATIVE", "Courier delayed by 4 days with no tracking updates"), ("CUSTOMER_SUPPORT", "NEGATIVE", "Customer care gave generic script answers")]),
    ("Value for money deal! Got 15% discount and free shipping on prepaid.", 5, "English", "POSITIVE", 0.89, ["Value for Money", "Discount Delight"], [("PRICE", "POSITIVE", "Value for money deal, 15% discount"), ("DELIVERY", "POSITIVE", "free shipping")]),
    ("Charger cable stopped working after 3 days. Very poor build quality.", 1, "English", "NEGATIVE", -0.85, ["Damaged Product", "Poor Quality"], [("QUALITY", "NEGATIVE", "stopped working after 3 days, Very poor build quality")])
]

def seed_reviews_and_voc(conn, target_reviews=3500):
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM reviews;")
    if cur.fetchone()[0] >= target_reviews:
        print("Reviews already seeded.")
        return

    print(f"Seeding {target_reviews} customer reviews with NLP sentiment and aspect annotations...")
    cur.execute("SELECT customer_id FROM customers LIMIT 5000;")
    cids = [r[0] for r in cur.fetchall()]
    
    cur.execute("SELECT product_id FROM products;")
    pids = [r[0] for r in cur.fetchall()]

    reviews_data = []
    analysis_data = []
    aspects_data = []
    suggestions_data = []

    for i in range(target_reviews):
        rid = f"REV_{10000 + i}"
        cid = random.choice(cids)
        pid = random.choice(pids)
        template = random.choice(SAMPLE_REVIEWS)
        rtext, rating, lang, sent, score, topics, aspect_list = template
        
        # Add slight variation in timestamp
        rtime = datetime.now() - timedelta(days=random.randint(1, 80), hours=random.randint(0, 23))

        reviews_data.append((rid, cid, pid, None, rtext, rating, lang, rtime))
        
        # Review analysis
        an_id = f"AN_{10000 + i}"
        analysis_data.append((an_id, rid, sent, score, round(abs(score) * 0.95 + 0.05, 3), Json(topics), lang, rtime))

        # Review aspects
        for asp, aspsent, evid in aspect_list:
            asp_id = f"ASP_{uuid.uuid4().hex[:12]}"
            asp_conf = 0.85 if aspsent == 'POSITIVE' else 0.90
            aspects_data.append((asp_id, rid, asp, aspsent, asp_conf, evid, rtime))

        # Suggestions generated from negative reviews
        if sent == 'NEGATIVE' and random.random() < 0.35:
            sug_id = f"SUG_{uuid.uuid4().hex[:12]}"
            sug_aspect = aspect_list[0][0]
            if sug_aspect == 'DELIVERY':
                sug_text = "Improve delivery SLA monitoring and switch to high-performance local courier partners."
                impact = "HIGH"
            elif sug_aspect == 'SIZE':
                sug_text = "Calibrate size chart with interactive centimeter guidance and customer body fit recommendations."
                impact = "HIGH"
            elif sug_aspect == 'PAYMENT':
                sug_text = "Implement automated payment retry and fallback gateway for UPI dropouts."
                impact = "CRITICAL"
            elif sug_aspect == 'PACKAGING':
                sug_text = "Upgrade carton ply count and introduce air-cushion bubble packaging for fragile items."
                impact = "MEDIUM"
            else:
                sug_text = "Conduct supplier quality audit for garment stitching and color fastness."
                impact = "MEDIUM"

            suggestions_data.append((sug_id, rid, cid, sug_aspect, sug_text, impact, 'HIGH' if impact == 'CRITICAL' else 'MEDIUM', 'OPEN', rtime))

    print(f"Bulk inserting {len(reviews_data)} reviews...")
    execute_batch(cur, "INSERT INTO reviews VALUES (%s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (review_id) DO NOTHING;", reviews_data, page_size=2000)

    print(f"Bulk inserting {len(analysis_data)} review analysis entries...")
    execute_batch(cur, "INSERT INTO review_analysis VALUES (%s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (analysis_id) DO NOTHING;", analysis_data, page_size=2000)

    print(f"Bulk inserting {len(aspects_data)} aspect entries...")
    execute_batch(cur, "INSERT INTO review_aspects VALUES (%s, %s, %s, %s, %s, %s, %s) ON CONFLICT (aspect_id) DO NOTHING;", aspects_data, page_size=2000)

    print(f"Bulk inserting {len(suggestions_data)} customer suggestions...")
    execute_batch(cur, "INSERT INTO customer_suggestions VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (suggestion_id) DO NOTHING;", suggestions_data, page_size=2000)

    # Populate Prioritized Seller Recommendations
    seller_recs = [
        (
            "REC_001",
            "North India Delivery Delays & Fake NDR Spike",
            "Logistics",
            24.50,
            -0.78,
            "HIGH",
            840000.00,
            "Review logistics partner SLA for North India tier-2/3 pin codes. Transition Delhivery/Shadowfax allocation to Bluedart priority air corridors to mitigate ₹8.4L monthly RTO losses.",
            "CRITICAL",
            "ACTIVE",
            datetime.now() - timedelta(days=2)
        ),
        (
            "REC_002",
            "Footwear & Denim Sizing Expectation Gap",
            "Product",
            19.20,
            -0.65,
            "HIGH",
            620000.00,
            "Calibrate size charts for Category Footwear & Denim. Deploy 3D interactive fit recommendation widget on product display pages to avert ₹6.2L in size-mismatch returns.",
            "HIGH",
            "ACTIVE",
            datetime.now() - timedelta(days=4)
        ),
        (
            "REC_003",
            "UPI Checkout Dropoff & Payment Timeout Friction",
            "Checkout",
            14.80,
            -0.82,
            "CRITICAL",
            1150000.00,
            "Enable 1-click Razorpay UPI intent retry and automatic SMS payment recovery link on checkout failure to capture ₹11.5L in dropped revenue.",
            "CRITICAL",
            "ACTIVE",
            datetime.now() - timedelta(days=1)
        ),
        (
            "REC_004",
            "Ceramic & Glassware Transit Packaging Damage",
            "Packaging",
            11.30,
            -0.55,
            "MEDIUM",
            340000.00,
            "Mandate 5-ply reinforced honeycomb packaging for home glassware and electronics to prevent ₹3.4L in damaged transit claims.",
            "MEDIUM",
            "ACTIVE",
            datetime.now() - timedelta(days=7)
        )
    ]

    execute_batch(cur, "INSERT INTO seller_recommendations VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (recommendation_id) DO NOTHING;", seller_recs)
    conn.commit()
    print("Reviews, NLP Aspect extractions, Customer Suggestions, and Seller Recommendations successfully seeded.")

def main():
    print("=== ReviveAI Database Migration & Seeding Initiated ===")
    conn = get_connection()
    try:
        apply_migrations(conn)
        seed_products(conn)
        enrich_customers(conn)
        seed_orders_returns_shipments(conn, target_orders=15000)
        seed_fraud_events(conn, target_fraud=400)
        seed_reviews_and_voc(conn, target_reviews=3500)
        print("=== Database Migration & Realistic Seeding Completed Successfully! ===")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
