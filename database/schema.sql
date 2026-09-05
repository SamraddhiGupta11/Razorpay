-- REVIVEAI DATABASE SCHEMA
-- PostgreSQL 18 Compatible DDL

-- Drop existing tables if re-initializing
DROP TABLE IF EXISTS model_predictions CASCADE;
DROP TABLE IF EXISTS conversions CASCADE;
DROP TABLE IF EXISTS interventions CASCADE;
DROP TABLE IF EXISTS abandoned_carts CASCADE;
DROP TABLE IF EXISTS checkout_sessions CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- 1. CUSTOMERS TABLE
CREATE TABLE customers (
    customer_id VARCHAR(50) PRIMARY KEY,
    customer_segment VARCHAR(20) NOT NULL CHECK (customer_segment IN ('VIP', 'Regular', 'Occasional', 'New')),
    is_returning BOOLEAN NOT NULL DEFAULT FALSE,
    previous_orders INT NOT NULL DEFAULT 0,
    previous_abandonments INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_segment ON customers(customer_segment);
CREATE INDEX idx_customers_returning ON customers(is_returning);

-- 2. CHECKOUT SESSIONS TABLE
CREATE TABLE checkout_sessions (
    checkout_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    cart_value NUMERIC(12, 2) NOT NULL CHECK (cart_value >= 0),
    item_count INT NOT NULL CHECK (item_count >= 1),
    device VARCHAR(20) NOT NULL CHECK (device IN ('Mobile', 'Desktop', 'Tablet')),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'COD', 'EMI')),
    shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    time_on_checkout_min NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    product_views INT NOT NULL DEFAULT 1,
    coupon_views INT NOT NULL DEFAULT 0,
    payment_attempts INT NOT NULL DEFAULT 1,
    payment_failed BOOLEAN NOT NULL DEFAULT FALSE,
    technical_errors INT NOT NULL DEFAULT 0,
    session_count INT NOT NULL DEFAULT 1,
    hour_of_day INT NOT NULL CHECK (hour_of_day BETWEEN 0 AND 23),
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_checkouts_customer ON checkout_sessions(customer_id);
CREATE INDEX idx_checkouts_cart_value ON checkout_sessions(cart_value);
CREATE INDEX idx_checkouts_started_at ON checkout_sessions(started_at);
CREATE INDEX idx_checkouts_device ON checkout_sessions(device);
CREATE INDEX idx_checkouts_payment ON checkout_sessions(payment_method);

-- 3. ABANDONED CARTS TABLE
CREATE TABLE abandoned_carts (
    abandoned_cart_id VARCHAR(50) PRIMARY KEY,
    checkout_id VARCHAR(50) NOT NULL UNIQUE REFERENCES checkout_sessions(checkout_id) ON DELETE CASCADE,
    abandonment_reason VARCHAR(30) NOT NULL CHECK (abandonment_reason IN ('SHIPPING', 'PAYMENT', 'PRICE', 'TECHNICAL', 'HESITATION', 'TRUST')),
    abandonment_probability NUMERIC(5, 4) NOT NULL CHECK (abandonment_probability BETWEEN 0 AND 1),
    recovery_probability NUMERIC(5, 4) NOT NULL CHECK (recovery_probability BETWEEN 0 AND 1),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'DETECTED' CHECK (status IN ('DETECTED', 'SCHEDULED', 'INTERVENED', 'RECOVERED', 'LOST', 'EXPIRED'))
);

CREATE INDEX idx_abandoned_checkout ON abandoned_carts(checkout_id);
CREATE INDEX idx_abandoned_reason ON abandoned_carts(abandonment_reason);
CREATE INDEX idx_abandoned_status ON abandoned_carts(status);
CREATE INDEX idx_abandoned_detected_at ON abandoned_carts(detected_at);

-- 4. INTERVENTIONS TABLE
CREATE TABLE interventions (
    intervention_id VARCHAR(50) PRIMARY KEY,
    abandoned_cart_id VARCHAR(50) NOT NULL REFERENCES abandoned_carts(abandoned_cart_id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('EMAIL', 'SMS', 'WHATSAPP')),
    action VARCHAR(30) NOT NULL CHECK (action IN ('NO_ACTION', 'PERSONALIZED_REMINDER', 'PAYMENT_ASSISTANCE', 'FREE_SHIPPING', 'DISCOUNT_5', 'DISCOUNT_10', 'TECH_SUPPORT')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    intervention_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SCHEDULED', 'SENT', 'DELIVERED', 'CLICKED', 'CONVERTED', 'FAILED'))
);

CREATE INDEX idx_interventions_cart ON interventions(abandoned_cart_id);
CREATE INDEX idx_interventions_channel ON interventions(channel);
CREATE INDEX idx_interventions_action ON interventions(action);
CREATE INDEX idx_interventions_status ON interventions(status);
CREATE INDEX idx_interventions_sent_at ON interventions(sent_at);

-- 5. CONVERSIONS TABLE
CREATE TABLE conversions (
    conversion_id VARCHAR(50) PRIMARY KEY,
    intervention_id VARCHAR(50) NOT NULL REFERENCES interventions(intervention_id) ON DELETE CASCADE,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    order_value NUMERIC(12, 2) NOT NULL CHECK (order_value >= 0),
    recovered_profit NUMERIC(12, 2) NOT NULL,
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversions_intervention ON conversions(intervention_id);
CREATE INDEX idx_conversions_customer ON conversions(customer_id);
CREATE INDEX idx_conversions_converted_at ON conversions(converted_at);

-- 6. MODEL PREDICTIONS AUDIT TABLE
CREATE TABLE model_predictions (
    prediction_id VARCHAR(50) PRIMARY KEY,
    checkout_id VARCHAR(50) NOT NULL REFERENCES checkout_sessions(checkout_id) ON DELETE CASCADE,
    model_name VARCHAR(50) NOT NULL,
    prediction NUMERIC(6, 5) NOT NULL,
    predicted_label VARCHAR(50),
    model_version VARCHAR(20) NOT NULL DEFAULT 'v1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_predictions_checkout ON model_predictions(checkout_id);
CREATE INDEX idx_predictions_model ON model_predictions(model_name);
