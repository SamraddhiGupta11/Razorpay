-- REVIVEAI PRODUCTION ANALYTICAL QUERIES

-- 1. Executive Summary KPIs
SELECT 
    COUNT(cs.checkout_id) AS total_checkouts,
    COUNT(ac.abandoned_cart_id) AS abandoned_checkouts,
    ROUND(COUNT(ac.abandoned_cart_id)::NUMERIC / NULLIF(COUNT(cs.checkout_id), 0) * 100, 2) AS abandonment_rate_pct,
    COALESCE(SUM(CASE WHEN ac.abandoned_cart_id IS NOT NULL THEN cs.cart_value ELSE 0 END), 0) AS revenue_at_risk,
    COALESCE(SUM(cv.order_value), 0) AS revenue_recovered,
    COALESCE(SUM(cv.recovered_profit), 0) AS net_recovered_profit,
    COALESCE(SUM(i.intervention_cost + i.discount_cost), 0) AS total_cost,
    ROUND(COUNT(cv.conversion_id)::NUMERIC / NULLIF(COUNT(ac.abandoned_cart_id), 0) * 100, 2) AS recovery_rate_pct,
    CASE 
        WHEN COALESCE(SUM(i.intervention_cost + i.discount_cost), 0) > 0 
        THEN ROUND((COALESCE(SUM(cv.recovered_profit), 0) / SUM(i.intervention_cost + i.discount_cost)) * 100, 2)
        ELSE 0 
    END AS roi_pct
FROM checkout_sessions cs
LEFT JOIN abandoned_carts ac ON cs.checkout_id = ac.checkout_id
LEFT JOIN interventions i ON ac.abandoned_cart_id = i.abandoned_cart_id
LEFT JOIN conversions cv ON i.intervention_id = cv.intervention_id;

-- 2. Revenue Leakage by Abandonment Reason
SELECT 
    ac.abandonment_reason,
    COUNT(ac.abandoned_cart_id) AS abandoned_count,
    ROUND(AVG(cs.cart_value), 2) AS avg_cart_value,
    SUM(cs.cart_value) AS total_revenue_at_risk,
    COUNT(cv.conversion_id) AS recovered_count,
    COALESCE(SUM(cv.order_value), 0) AS recovered_revenue,
    ROUND(COUNT(cv.conversion_id)::NUMERIC / NULLIF(COUNT(ac.abandoned_cart_id), 0) * 100, 2) AS recovery_rate_pct
FROM abandoned_carts ac
JOIN checkout_sessions cs ON ac.checkout_id = cs.checkout_id
LEFT JOIN interventions i ON ac.abandoned_cart_id = i.abandoned_cart_id
LEFT JOIN conversions cv ON i.intervention_id = cv.intervention_id
GROUP BY ac.abandonment_reason
ORDER BY total_revenue_at_risk DESC;

-- 3. Recovery Performance by Customer Segment
SELECT 
    c.customer_segment,
    COUNT(DISTINCT c.customer_id) AS total_customers,
    COUNT(ac.abandoned_cart_id) AS total_abandonments,
    COALESCE(SUM(cs.cart_value), 0) AS total_at_risk,
    COUNT(cv.conversion_id) AS total_conversions,
    COALESCE(SUM(cv.order_value), 0) AS total_recovered_revenue,
    ROUND(COUNT(cv.conversion_id)::NUMERIC / NULLIF(COUNT(ac.abandoned_cart_id), 0) * 100, 2) AS segment_recovery_rate
FROM customers c
JOIN checkout_sessions cs ON c.customer_id = cs.customer_id
LEFT JOIN abandoned_carts ac ON cs.checkout_id = ac.checkout_id
LEFT JOIN interventions i ON ac.abandoned_cart_id = i.abandoned_cart_id
LEFT JOIN conversions cv ON i.intervention_id = cv.intervention_id
GROUP BY c.customer_segment
ORDER BY total_recovered_revenue DESC;

-- 4. Channel and Action Performance Matrix
SELECT 
    i.channel,
    i.action,
    COUNT(i.intervention_id) AS interventions_sent,
    COUNT(cv.conversion_id) AS conversions,
    ROUND(COUNT(cv.conversion_id)::NUMERIC / NULLIF(COUNT(i.intervention_id), 0) * 100, 2) AS conversion_rate_pct,
    COALESCE(SUM(cv.order_value), 0) AS revenue_generated,
    COALESCE(SUM(i.intervention_cost), 0) AS total_channel_cost,
    COALESCE(SUM(i.discount_cost), 0) AS total_discount_cost,
    COALESCE(SUM(cv.recovered_profit), 0) AS net_profit
FROM interventions i
LEFT JOIN conversions cv ON i.intervention_id = cv.intervention_id
GROUP BY i.channel, i.action
ORDER BY net_profit DESC;
