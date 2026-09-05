-- REVIVEAI DATABASE MIGRATION: 002_protection_and_voc.sql
-- Revenue Protection Center & Voice of Customer Intelligence Schema

-- 1. Safely enrich CUSTOMERS table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS email VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS location VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS lifetime_orders INT DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS lifetime_value NUMERIC(12, 2) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS average_order_value NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS return_rate NUMERIC(5, 4) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS cancellation_rate NUMERIC(5, 4) DEFAULT 0.00;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferred_payment_method VARCHAR(30) DEFAULT 'UPI';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferred_channel VARCHAR(20) DEFAULT 'WHATSAPP';

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    margin NUMERIC(5, 4) NOT NULL DEFAULT 0.35,
    weight_kg NUMERIC(6, 3) NOT NULL DEFAULT 0.500,
    return_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.05,
    size_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
    fragile BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_size_sensitive ON products(size_sensitive);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    order_value NUMERIC(12, 2) NOT NULL CHECK (order_value >= 0),
    discount_percentage NUMERIC(5, 2) DEFAULT 0.0,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    order_status VARCHAR(20) NOT NULL DEFAULT 'DELIVERED',
    shipping_address_region VARCHAR(50) NOT NULL,
    shipping_pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 4. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(order_id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    gateway VARCHAR(30) NOT NULL DEFAULT 'Razorpay',
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    error_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- 5. RETURNS TABLE
CREATE TABLE IF NOT EXISTS returns (
    return_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    refund_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_returns_order ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_customer ON returns(customer_id);
CREATE INDEX IF NOT EXISTS idx_returns_product ON returns(product_id);

-- 6. RETURN RISK SCORES TABLE
CREATE TABLE IF NOT EXISTS return_risk_scores (
    risk_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    return_probability NUMERIC(5, 4) NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    top_reasons JSONB,
    expected_loss NUMERIC(10, 2) NOT NULL,
    recommended_action VARCHAR(50) NOT NULL,
    action_status VARCHAR(20) DEFAULT 'RECOMMENDED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_return_risk_order ON return_risk_scores(order_id);
CREATE INDEX IF NOT EXISTS idx_return_risk_level ON return_risk_scores(risk_level);

-- 7. SHIPMENTS TABLE
CREATE TABLE IF NOT EXISTS shipments (
    shipment_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    carrier VARCHAR(50) NOT NULL,
    tracking_number VARCHAR(100) NOT NULL,
    origin_hub VARCHAR(50) NOT NULL,
    destination_region VARCHAR(50) NOT NULL,
    destination_pincode VARCHAR(10) NOT NULL,
    is_cod BOOLEAN NOT NULL DEFAULT FALSE,
    cod_amount NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'IN_TRANSIT',
    delivery_attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier ON shipments(carrier);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);

-- 8. LOGISTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS logistics_events (
    event_id VARCHAR(50) PRIMARY KEY,
    shipment_id VARCHAR(50) NOT NULL REFERENCES shipments(shipment_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    location VARCHAR(100),
    delay_hours NUMERIC(6, 2) DEFAULT 0.0,
    anomaly_flag BOOLEAN DEFAULT FALSE,
    anomaly_type VARCHAR(50),
    risk_classification VARCHAR(30) DEFAULT 'UNKNOWN',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_logistics_shipment ON logistics_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_logistics_anomaly ON logistics_events(anomaly_flag);

-- 9. RTO RISK SCORES TABLE
CREATE TABLE IF NOT EXISTS rto_risk_scores (
    risk_id VARCHAR(50) PRIMARY KEY,
    shipment_id VARCHAR(50) NOT NULL REFERENCES shipments(shipment_id) ON DELETE CASCADE,
    rto_probability NUMERIC(5, 4) NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    top_reasons JSONB,
    expected_loss NUMERIC(10, 2) NOT NULL,
    recommended_action VARCHAR(50) NOT NULL,
    action_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rto_risk_shipment ON rto_risk_scores(shipment_id);
CREATE INDEX IF NOT EXISTS idx_rto_risk_level ON rto_risk_scores(risk_level);

-- 10. FRAUD EVENTS TABLE
CREATE TABLE IF NOT EXISTS fraud_events (
    fraud_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    order_id VARCHAR(50) REFERENCES orders(order_id) ON DELETE SET NULL,
    fraud_score NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(30) NOT NULL CHECK (risk_level IN ('LOW_RISK', 'MONITOR', 'MANUAL_REVIEW', 'ENHANCED_VERIFICATION')),
    signals JSONB,
    recommended_action VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fraud_customer ON fraud_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_fraud_level ON fraud_events(risk_level);

-- 11. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    review_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    order_id VARCHAR(50) REFERENCES orders(order_id) ON DELETE SET NULL,
    review_text TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    language VARCHAR(20) DEFAULT 'English',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- 12. REVIEW ANALYSIS TABLE
CREATE TABLE IF NOT EXISTS review_analysis (
    analysis_id VARCHAR(50) PRIMARY KEY,
    review_id VARCHAR(50) NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
    sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
    sentiment_score NUMERIC(5, 4) NOT NULL,
    confidence NUMERIC(5, 4) NOT NULL,
    topics JSONB,
    language_detected VARCHAR(30) DEFAULT 'English',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_analysis_review ON review_analysis(review_id);
CREATE INDEX IF NOT EXISTS idx_review_analysis_sentiment ON review_analysis(sentiment);

-- 13. REVIEW ASPECTS TABLE
CREATE TABLE IF NOT EXISTS review_aspects (
    aspect_id VARCHAR(50) PRIMARY KEY,
    review_id VARCHAR(50) NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
    aspect VARCHAR(30) NOT NULL,
    sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
    confidence NUMERIC(5, 4) NOT NULL,
    evidence TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_review_aspects_review ON review_aspects(review_id);
CREATE INDEX IF NOT EXISTS idx_review_aspects_aspect ON review_aspects(aspect);

-- 14. CUSTOMER SUGGESTIONS TABLE
CREATE TABLE IF NOT EXISTS customer_suggestions (
    suggestion_id VARCHAR(50) PRIMARY KEY,
    review_id VARCHAR(50) REFERENCES reviews(review_id) ON DELETE SET NULL,
    customer_id VARCHAR(50) REFERENCES customers(customer_id) ON DELETE CASCADE,
    aspect VARCHAR(30) NOT NULL,
    suggestion_text TEXT NOT NULL,
    business_impact VARCHAR(20) DEFAULT 'MEDIUM',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_suggestions_customer ON customer_suggestions(customer_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_priority ON customer_suggestions(priority);

-- 15. SELLER RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS seller_recommendations (
    recommendation_id VARCHAR(50) PRIMARY KEY,
    issue VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    frequency_pct NUMERIC(5, 2) NOT NULL,
    sentiment_score NUMERIC(5, 4) NOT NULL,
    business_impact VARCHAR(20) NOT NULL,
    estimated_monthly_impact NUMERIC(12, 2) NOT NULL,
    recommendation_text TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seller_recs_priority ON seller_recommendations(priority);
