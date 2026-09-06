// Realistic offline / GitHub Pages fallback dataset matching PostgreSQL 18 schemas
export const mockData = {
  health: {
    status: 'healthy',
    database: 'connected',
    models_loaded: 5,
    environment: 'demo-mode'
  },

  dashboardSummary: {
    total_checkouts: 100000,
    abandoned_checkouts: 38248,
    abandonment_rate_pct: 38.25,
    revenue_at_risk: 226376255.0,
    revenue_recovered: 100491453.0,
    net_recovered_profit: 29627962.0,
    recovery_rate_pct: 46.11,
    total_intervention_cost: 1147858.0,
    overall_roi_pct: 2581.15
  },

  dashboardCharts: {
    reasons: [
      { reason: 'PAYMENT', count: 10676, revenue_at_risk: 61222585.0, revenue_recovered: 25922973.0, recovered_profit: 7763844.0, recovery_rate_pct: 44.5 },
      { reason: 'TECHNICAL', count: 7663, revenue_at_risk: 45616233.0, revenue_recovered: 18355191.0, recovered_profit: 5497766.0, recovery_rate_pct: 41.3 },
      { reason: 'SHIPPING', count: 5703, revenue_at_risk: 17257811.0, revenue_recovered: 8157124.0, recovered_profit: 2439473.0, recovery_rate_pct: 48.1 },
      { reason: 'HESITATION', count: 2537, revenue_at_risk: 14694926.0, revenue_recovered: 7146114.0, recovered_profit: 2140362.0, recovery_rate_pct: 49.3 },
      { reason: 'PRICE', count: 1507, revenue_at_risk: 21571996.0, revenue_recovered: 9416499.0, recovered_profit: 2352062.0, recovery_rate_pct: 49.2 },
      { reason: 'TRUST', count: 10162, revenue_at_risk: 66012704.0, revenue_recovered: 31493551.0, recovered_profit: 9434455.0, recovery_rate_pct: 49.0 }
    ],
    channels: [
      { channel: 'WHATSAPP', count: 9605, recovered_revenue: 54465492.0, net_profit: 16046909.0, roi_pct: 5481.7 },
      { channel: 'SMS', count: 4391, recovered_revenue: 25164912.0, net_profit: 7419923.0, roi_pct: 5727.5 },
      { channel: 'EMAIL', count: 3640, recovered_revenue: 20861049.0, net_profit: 6161130.0, roi_pct: 6339.6 }
    ],
    segments: [
      { segment: 'Regular', count: 17014, revenue_at_risk: 100696522.0, revenue_recovered: 47752192.0, recovery_rate_pct: 48.8 },
      { segment: 'Occasional', count: 12105, revenue_at_risk: 71402203.0, revenue_recovered: 29453865.0, recovery_rate_pct: 42.8 },
      { segment: 'New', count: 7044, revenue_at_risk: 41188049.0, revenue_recovered: 15496775.0, recovery_rate_pct: 40.2 },
      { segment: 'VIP', count: 2085, revenue_at_risk: 13089481.0, revenue_recovered: 7788621.0, recovery_rate_pct: 62.9 }
    ],
    timeline: [
      { date: '2026-02-27', abandoned: 1280, recovered: 590, revenue_recovered: 3250000 },
      { date: '2026-02-28', abandoned: 1340, recovered: 620, revenue_recovered: 3480000 },
      { date: '2026-03-01', abandoned: 1410, recovered: 650, revenue_recovered: 3650000 },
      { date: '2026-03-02', abandoned: 1490, recovered: 690, revenue_recovered: 3910000 },
      { date: '2026-03-03', abandoned: 1460, recovered: 675, revenue_recovered: 3820000 },
      { date: '2026-03-04', abandoned: 1520, recovered: 700, revenue_recovered: 3990000 },
      { date: '2026-03-05', abandoned: 1580, recovered: 730, revenue_recovered: 4150000 }
    ]
  },

  protectionOverview: {
    summary: {
      total_orders: 15000,
      total_returns: 1757,
      return_rate_pct: 11.71,
      total_shipments: 15000,
      total_rto: 950,
      rto_rate_pct: 6.33,
      logistics_anomalies: 2102,
      active_fraud_alerts: 85,
      revenue_protected: 4150000.0,
      returns_prevented_loss: 562500.0,
      rto_prevented_loss: 442000.0,
      fraud_loss_prevented: 323000.0
    },
    carriers: [
      { carrier: 'Bluedart', total_shipments: 4500, rto_count: 210, rto_rate_pct: 4.67, avg_attempts: 1.3 },
      { carrier: 'Delhivery', total_shipments: 5200, rto_count: 310, rto_rate_pct: 5.96, avg_attempts: 1.5 },
      { carrier: 'Shadowfax', total_shipments: 3100, rto_count: 240, rto_rate_pct: 7.74, avg_attempts: 1.8 },
      { carrier: 'Xpressbees', total_shipments: 2200, rto_count: 190, rto_rate_pct: 8.64, avg_attempts: 1.9 }
    ]
  },

  reviewInsights: {
    total_reviews: 3500,
    positive_count: 2100,
    neutral_count: 450,
    negative_count: 950,
    positive_pct: 60.0,
    neutral_pct: 12.9,
    negative_pct: 27.1,
    active_seller_recommendations: 4,
    aspects: [
      { aspect: 'Delivery', total_mentions: 1240, positive_count: 610, negative_count: 630, net_sentiment_pct: -1.6, confidence: 0.88 },
      { aspect: 'Product Quality', total_mentions: 1560, positive_count: 1180, negative_count: 380, net_sentiment_pct: 51.3, confidence: 0.91 },
      { aspect: 'Sizing & Fit', total_mentions: 890, positive_count: 390, negative_count: 500, net_sentiment_pct: -12.4, confidence: 0.84 },
      { aspect: 'Pricing', total_mentions: 650, positive_count: 410, negative_count: 240, net_sentiment_pct: 26.2, confidence: 0.79 },
      { aspect: 'Payment', total_mentions: 430, positive_count: 290, negative_count: 140, net_sentiment_pct: 34.9, confidence: 0.86 },
      { aspect: 'Packaging', total_mentions: 510, positive_count: 380, negative_count: 130, net_sentiment_pct: 49.0, confidence: 0.82 }
    ],
    languages: {
      en: 1850,
      hi: 820,
      hinglish: 830
    },
    suggestions: [
      { aspect: 'Sizing & Fit', suggestion_text: 'Update size chart on ethnic wear SKUs to reduce 35% return rate.', business_impact: 'Saves approx ₹4.2L in return logistics', priority: 'HIGH', customer_name: 'Pooja Nair' },
      { aspect: 'Delivery', suggestion_text: 'Review Shadowfax dispatch SLA in tier-3 cities due to repeat fake NDRs.', business_impact: 'Reduces RTO bounces by 18%', priority: 'HIGH', customer_name: 'Ankit Mehta' },
      { aspect: 'Packaging', suggestion_text: 'Introduce tamper-proof bubble seals for fragile beauty items.', business_impact: 'Reduces damaged-in-transit claims', priority: 'MEDIUM', customer_name: 'Rohan Joshi' }
    ]
  },

  demoScenarios: [
    {
      id: 1,
      pillar: 'RECOVER',
      title: 'Shipping Fee Shock Recovery',
      customer_id: 'DEMO_CUST_RAHUL',
      customer_name: 'Rahul Sharma',
      customer_segment: 'VIP',
      location: 'Mumbai',
      cart_value: 80000.0,
      shipping_cost: 1500.0,
      signal: 'Shipping cost is 1.9% of high-ticket cart; customer dropped at delivery step.',
      expected_reason: 'SHIPPING',
      recommended_action: 'FREE_SHIPPING',
      channel: 'WHATSAPP',
      expected_revenue: 80000.0,
      action_cost: 1500.0,
      expected_profit: 26500.0,
      roi_pct: 1767.0
    },
    {
      id: 2,
      pillar: 'RECOVER',
      title: 'UPI Payment Gateway Failure',
      customer_id: 'DEMO_CUST_PRIYA',
      customer_name: 'Priya Patel',
      customer_segment: 'Regular',
      location: 'Bengaluru',
      cart_value: 35000.0,
      shipping_cost: 0.0,
      signal: '2 consecutive UPI gateway bank timeouts on Razorpay checkout.',
      expected_reason: 'PAYMENT',
      recommended_action: 'PAYMENT_ASSISTANCE',
      channel: 'WHATSAPP',
      expected_revenue: 35000.0,
      action_cost: 1.50,
      expected_profit: 12248.50,
      roi_pct: 816567.0
    },
    {
      id: 3,
      pillar: 'RECOVER',
      title: 'Coupon Hunting Price Hesitation',
      customer_id: 'DEMO_CUST_AMAN',
      customer_name: 'Aman Verma',
      customer_segment: 'Occasional',
      location: 'Delhi',
      cart_value: 12000.0,
      shipping_cost: 49.0,
      signal: '4 promo code entry attempts; abandoned after invalid voucher response.',
      expected_reason: 'PRICE',
      recommended_action: 'DISCOUNT_5',
      channel: 'SMS',
      expected_revenue: 12000.0,
      action_cost: 600.80,
      expected_profit: 3599.20,
      roi_pct: 599.0
    },
    {
      id: 4,
      pillar: 'RECOVER',
      title: 'Technical Checkout Glitch Dropoff',
      customer_id: 'DEMO_CUST_RAVI',
      customer_name: 'Ravi Kumar',
      customer_segment: 'Regular',
      location: 'Hyderabad',
      cart_value: 25000.0,
      shipping_cost: 0.0,
      signal: '2 JavaScript DOM exception errors encountered during address validation.',
      expected_reason: 'TECHNICAL',
      recommended_action: 'TECH_SUPPORT',
      channel: 'WHATSAPP',
      expected_revenue: 25000.0,
      action_cost: 1.50,
      expected_profit: 8748.50,
      roi_pct: 583233.0
    },
    {
      id: 5,
      pillar: 'RECOVER',
      title: 'White-Glove VIP Concierge Recovery',
      customer_id: 'DEMO_CUST_NEHA',
      customer_name: 'Neha Gupta',
      customer_segment: 'VIP',
      location: 'Mumbai',
      cart_value: 60000.0,
      shipping_cost: 0.0,
      signal: '18 prior orders, ₹2.8L lifetime spend; dropped at review step.',
      expected_reason: 'HESITATION',
      recommended_action: 'VIP_CONCIERGE',
      channel: 'WHATSAPP',
      expected_revenue: 60000.0,
      action_cost: 50.0,
      expected_profit: 20950.0,
      roi_pct: 41900.0
    },
    {
      id: 6,
      pillar: 'PROTECT_RETURNS',
      title: 'Apparel Size Confusion Return Hazard',
      customer_id: 'DEMO_CUST_KAVITA',
      customer_name: 'Kavita Iyer',
      customer_segment: 'Regular',
      location: 'Pune',
      cart_value: 14500.0,
      shipping_cost: 0.0,
      signal: 'Customer bought 2 adjacent sizes (M & L) in Women Embroidered Kurta with high return velocity.',
      expected_reason: 'SIZE_UNCERTAINTY',
      recommended_action: 'SIZING_CONSULTATION',
      channel: 'WHATSAPP',
      expected_revenue: 14500.0,
      action_cost: 2.00,
      expected_profit: 5073.0,
      roi_pct: 253650.0
    },
    {
      id: 7,
      pillar: 'PROTECT_RTO',
      title: 'High Risk COD Delivery Bounce Radar',
      customer_id: 'DEMO_CUST_VIKAS',
      customer_name: 'Vikas Dubey',
      customer_segment: 'New',
      location: 'Kanpur',
      cart_value: 8500.0,
      shipping_cost: 0.0,
      signal: 'COD order in high-RTO PIN code 208001 with incomplete address street line.',
      expected_reason: 'HIGH_RTO_PINCODE',
      recommended_action: 'WHATSAPP_ADDRESS_CONFIRM',
      channel: 'WHATSAPP',
      expected_revenue: 8500.0,
      action_cost: 1.50,
      expected_profit: 2973.50,
      roi_pct: 198233.0
    },
    {
      id: 8,
      pillar: 'PROTECT_FRAUD',
      title: 'Card-Testing Velocity Attack Surge',
      customer_id: 'DEMO_CUST_BOT',
      customer_name: 'Suspicious Guest Session',
      customer_segment: 'Unknown',
      location: 'Proxy / TOR IP',
      cart_value: 4500.0,
      shipping_cost: 0.0,
      signal: '6 failed cards from disparate BIN ranges in 90 seconds with script headers.',
      expected_reason: 'CARD_TESTING_VELOCITY',
      recommended_action: 'ENHANCED_VERIFICATION',
      channel: 'SYSTEM_BLOCK',
      expected_revenue: 4500.0,
      action_cost: 0.0,
      expected_profit: 1575.0,
      roi_pct: 157500.0
    }
  ],

  customer360: {
    customer_id: 'DEMO_CUST_RAHUL',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98201 54321',
    city: 'Mumbai',
    segment: 'VIP',
    lifetime_value: 285000.0,
    order_count: 14,
    risk_score: 28,
    metrics: {
      abandonment_rate: '21.4%',
      return_rate: '7.1%',
      rto_rate: '0.0%',
      sentiment_score: '+0.75'
    },
    timeline: [
      { id: '1', timestamp: '2026-03-05 18:42:10', type: 'CHECKOUT_ABANDONED', description: 'Cart ₹80,000 abandoned at delivery fee step (Shipping Fee Shock ₹1,500)' },
      { id: '2', timestamp: '2026-03-05 18:42:15', type: 'INTERVENTION_SENT', description: 'Personalized WhatsApp sent with FREE_SHIPPING voucher' },
      { id: '3', timestamp: '2026-03-05 18:46:30', type: 'CHECKOUT_CONVERTED', description: 'Order #ORD-9821 converted for ₹80,000. Net profit ₹26,500' },
      { id: '4', timestamp: '2026-02-14 11:20:00', type: 'ORDER_DELIVERED', description: 'Delivered Sony Bravia 55" 4K TV on time via Bluedart' },
      { id: '5', timestamp: '2026-02-16 15:10:00', type: 'REVIEW_MINED', description: 'Positive review: "Mast delivery aur TV ekdum top notch hai!" (Score: +0.85)' }
    ]
  },

  abandonedCheckouts: [
    {
      checkout_id: 'CHK-100249',
      abandoned_cart_id: 'CHK-100249',
      customer_name: 'Rahul Sharma',
      customer_id: 'DEMO_CUST_RAHUL',
      customer_segment: 'VIP',
      cart_value: 80000.0,
      shipping_cost: 1500.0,
      abandonment_reason: 'SHIPPING',
      created_at: '2026-03-05 18:42:10',
      status: 'ABANDONED',
      risk_score: 88,
      recommended_action: 'FREE_SHIPPING',
      channel: 'WHATSAPP',
      expected_profit: 26500.0
    },
    {
      checkout_id: 'CHK-100248',
      abandoned_cart_id: 'CHK-100248',
      customer_name: 'Priya Patel',
      customer_id: 'DEMO_CUST_PRIYA',
      customer_segment: 'Regular',
      cart_value: 35000.0,
      shipping_cost: 49.0,
      abandonment_reason: 'PAYMENT',
      created_at: '2026-03-05 18:15:20',
      status: 'ABANDONED',
      risk_score: 82,
      recommended_action: 'PAYMENT_ASSISTANCE',
      channel: 'WHATSAPP',
      expected_profit: 12248.50
    },
    {
      checkout_id: 'CHK-100247',
      abandoned_cart_id: 'CHK-100247',
      customer_name: 'Aman Verma',
      customer_id: 'DEMO_CUST_AMAN',
      customer_segment: 'Occasional',
      cart_value: 12000.0,
      shipping_cost: 49.0,
      abandonment_reason: 'PRICE',
      created_at: '2026-03-05 17:50:45',
      status: 'ABANDONED',
      risk_score: 74,
      recommended_action: 'DISCOUNT_5',
      channel: 'SMS',
      expected_profit: 3599.20
    },
    {
      checkout_id: 'CHK-100246',
      abandoned_cart_id: 'CHK-100246',
      customer_name: 'Ravi Kumar',
      customer_id: 'DEMO_CUST_RAVI',
      customer_segment: 'Regular',
      cart_value: 25000.0,
      shipping_cost: 49.0,
      abandonment_reason: 'TECHNICAL',
      created_at: '2026-03-05 17:22:10',
      status: 'ABANDONED',
      risk_score: 79,
      recommended_action: 'TECH_SUPPORT',
      channel: 'WHATSAPP',
      expected_profit: 8748.50
    },
    {
      checkout_id: 'CHK-100245',
      abandoned_cart_id: 'CHK-100245',
      customer_name: 'Neha Gupta',
      customer_id: 'DEMO_CUST_NEHA',
      customer_segment: 'VIP',
      cart_value: 60000.0,
      shipping_cost: 49.0,
      abandonment_reason: 'HESITATION',
      created_at: '2026-03-05 16:45:00',
      status: 'ABANDONED',
      risk_score: 65,
      recommended_action: 'VIP_CONCIERGE',
      channel: 'WHATSAPP',
      expected_profit: 20950.0
    }
  ],

  returnOrders: [
    {
      order_id: 'ORD-88210',
      customer_name: 'Kavita Iyer',
      customer_id: 'DEMO_CUST_KAVITA',
      product_name: 'Embroidered Silk Kurta Set',
      category: 'Apparel',
      order_value: 14500.0,
      return_risk_score: 0.82,
      risk_tier: 'HIGH',
      recommended_action: 'SIZING_CONSULTATION',
      expected_loss: 5075.0
    },
    {
      order_id: 'ORD-88209',
      customer_name: 'Siddharth Rao',
      customer_id: 'CUST-3912',
      product_name: 'Leather Oxford Shoes',
      category: 'Footwear',
      order_value: 6500.0,
      return_risk_score: 0.74,
      risk_tier: 'HIGH',
      recommended_action: 'FIT_GUIDANCE',
      expected_loss: 2275.0
    }
  ],

  rtoShipments: [
    {
      tracking_number: 'TRK-99201',
      order_id: 'ORD-88190',
      carrier: 'Shadowfax',
      customer_name: 'Vikas Dubey',
      destination_city: 'Kanpur',
      rto_risk_score: 0.78,
      risk_tier: 'HIGH',
      status: 'IN_TRANSIT',
      payment_type: 'COD',
      recommended_action: 'WHATSAPP_ADDRESS_CONFIRM'
    },
    {
      tracking_number: 'TRK-99202',
      order_id: 'ORD-88185',
      carrier: 'Xpressbees',
      customer_name: 'Manish Pandey',
      destination_city: 'Varanasi',
      rto_risk_score: 0.71,
      risk_tier: 'HIGH',
      status: 'IN_TRANSIT',
      payment_type: 'COD',
      recommended_action: 'CALL_VERIFICATION'
    }
  ],

  fraudAlerts: [
    {
      alert_id: 'FRD-1049',
      customer_name: 'Guest User (IP: 185.220.101.5)',
      cart_value: 4500.0,
      risk_level: 'CRITICAL',
      trigger_reason: 'Card-testing velocity: 6 failed card BINs in 90 seconds',
      action_taken: 'ENHANCED_VERIFICATION',
      created_at: '2026-03-05 19:10:00'
    },
    {
      alert_id: 'FRD-1048',
      customer_name: 'Rahul Khanna',
      cart_value: 95000.0,
      risk_level: 'HIGH',
      trigger_reason: 'Shipping address mismatch with geolocation (>1,200 km difference)',
      action_taken: 'MANUAL_REVIEW',
      created_at: '2026-03-05 18:30:00'
    }
  ],

  modelsStatus: [
    { name: 'Model 1: Checkout Abandonment Predictor', status: 'ACTIVE', algorithm: 'XGBoost Classifier', accuracy: '89.4%', last_trained: '2026-03-01' },
    { name: 'Model 2: Next Best Action & Recovery Elasticity', status: 'ACTIVE', algorithm: 'Multi-Task Gradient Boosting', accuracy: '84.2%', last_trained: '2026-03-01' },
    { name: 'Model 3: Pre-Fulfillment Return Risk', status: 'ACTIVE', algorithm: 'Random Forest Classifier', accuracy: '86.1%', last_trained: '2026-03-01' },
    { name: 'Model 4: In-Transit RTO Risk Radar', status: 'ACTIVE', algorithm: 'XGBoost with Spatial Heuristics', accuracy: '88.7%', last_trained: '2026-03-01' },
    { name: 'Model 5: Unsupervised Fraud Anomaly Engine', status: 'ACTIVE', algorithm: 'Isolation Forest (150 trees)', accuracy: '94.8%', last_trained: '2026-03-01' }
  ]
};
