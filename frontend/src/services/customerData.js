/**
 * Comprehensive Customer Intelligence & Customer 360 Dataset
 * Auto-generated with 35 diverse customer profiles across VIP, Regular, Occasional, and New tiers.
 * Provides fallback data for offline mode and GitHub Pages deployment.
 */

export const customersList = [
  {
    "customer_id": "DEMO_CUST_RAHUL",
    "name": "Rahul Sharma",
    "email": "rahul.sharma@example.in",
    "phone": "+91 98201 12345",
    "location": "Mumbai, Maharashtra",
    "customer_segment": "VIP",
    "segment": "VIP",
    "is_returning": true,
    "previous_orders": 14,
    "previous_abandonments": 1,
    "lifetime_orders": 16,
    "lifetime_value": 285000.0,
    "lifetime_cart_value": 376200.0,
    "average_order_value": 20357.0,
    "total_sessions": 18,
    "total_recovered_spent": 108300.0,
    "total_abandonments_recorded": 1,
    "return_rate": 0.071,
    "cancellation_rate": 0.02,
    "preferred_payment_method": "Credit Card",
    "preferred_channel": "WHATSAPP",
    "risk_score": 28.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-RAHUL-201",
        "device": "Mobile (iOS)",
        "payment_method": "Credit Card",
        "cart_value": 23410.55,
        "shipping_cost": 0.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-RAHUL-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Credit Card",
        "cart_value": 19339.15,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-RAHUL-203",
        "device": "Mobile (Android)",
        "payment_method": "Credit Card",
        "cart_value": 21374.85,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_RAHUL",
      "name": "Rahul Sharma",
      "email": "rahul.sharma@example.in",
      "phone": "+91 98201 12345",
      "location": "Mumbai, Maharashtra",
      "customer_segment": "VIP",
      "lifetime_orders": 14,
      "lifetime_value": 285000.0,
      "average_order_value": 20357.0,
      "return_rate_pct": 7.1,
      "preferred_payment_method": "Credit Card",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 28.0,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 25.0,
      "return_risk": 17.8,
      "rto_risk": 4.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "VIP_CONCIERGE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 24428.4,
      "expected_profit": 7817.09,
      "economic_rationale": "High lifetime value VIP customer; proactively assign priority concierge."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-AHUL-891",
          "product_name": "Premium Electronics & Smart Home",
          "category": "Electronics",
          "order_value": 20357.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-AHUL-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 17303.45,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-RAHUL-201",
          "device": "Mobile (iOS)",
          "payment_method": "Credit Card",
          "cart_value": 23410.55,
          "shipping_cost": 0.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-RAHUL-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Credit Card",
          "cart_value": 19339.15,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-RAHUL-203",
          "device": "Mobile (Android)",
          "payment_method": "Credit Card",
          "cart_value": 21374.85,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_PRIYA",
    "name": "Priya Patel",
    "email": "priya.patel@example.in",
    "phone": "+91 98450 67890",
    "location": "Bengaluru, Karnataka",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 8,
    "previous_abandonments": 2,
    "lifetime_orders": 10,
    "lifetime_value": 68000.0,
    "lifetime_cart_value": 89760.0,
    "average_order_value": 8500.0,
    "total_sessions": 12,
    "total_recovered_spent": 14960.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.05,
    "cancellation_rate": 0.02,
    "preferred_payment_method": "UPI",
    "preferred_channel": "WHATSAPP",
    "risk_score": 42.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-PRIYA-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 9775.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-PRIYA-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 8075.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-PRIYA-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 8925.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_PRIYA",
      "name": "Priya Patel",
      "email": "priya.patel@example.in",
      "phone": "+91 98450 67890",
      "location": "Bengaluru, Karnataka",
      "customer_segment": "Regular",
      "lifetime_orders": 8,
      "lifetime_value": 68000.0,
      "average_order_value": 8500.0,
      "return_rate_pct": 5.0,
      "preferred_payment_method": "UPI",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 42.0,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 50.0,
      "return_risk": 12.5,
      "rto_risk": 4.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 10200.0,
      "expected_profit": 3264.0,
      "economic_rationale": "Frequent UPI user with minor checkout dropoff; recover with instant free delivery."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-RIYA-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 8500.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-RIYA-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 7225.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-PRIYA-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 9775.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-PRIYA-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 8075.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-PRIYA-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 8925.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_AMAN",
    "name": "Aman Verma",
    "email": "aman.verma@example.in",
    "phone": "+91 98110 54321",
    "location": "Delhi, NCR",
    "customer_segment": "Occasional",
    "segment": "Occasional",
    "is_returning": true,
    "previous_orders": 4,
    "previous_abandonments": 3,
    "lifetime_orders": 5,
    "lifetime_value": 24000.0,
    "lifetime_cart_value": 31680.0,
    "average_order_value": 6000.0,
    "total_sessions": 9,
    "total_recovered_spent": 5280.0,
    "total_abandonments_recorded": 3,
    "return_rate": 0.02,
    "cancellation_rate": 0.05,
    "preferred_payment_method": "UPI",
    "preferred_channel": "SMS",
    "risk_score": 62.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-_AMAN-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 6900.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-_AMAN-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 5700.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-_AMAN-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 6300.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_AMAN",
      "name": "Aman Verma",
      "email": "aman.verma@example.in",
      "phone": "+91 98110 54321",
      "location": "Delhi, NCR",
      "customer_segment": "Occasional",
      "lifetime_orders": 4,
      "lifetime_value": 24000.0,
      "average_order_value": 6000.0,
      "return_rate_pct": 2.0,
      "preferred_payment_method": "UPI",
      "preferred_channel": "SMS"
    },
    "unified_revenue_risk": {
      "composite_score": 62.0,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 75.0,
      "return_risk": 5.0,
      "rto_risk": 10.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "DYNAMIC_DISCOUNT",
      "priority": "HIGH",
      "channel": "SMS",
      "expected_revenue": 7200.0,
      "expected_profit": 2304.0,
      "economic_rationale": "Price-sensitive coupon seeker; deliver 10% flash incentive to finalize order."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-AMAN-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 6000.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-AMAN-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 5100.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-_AMAN-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 6900.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-_AMAN-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 5700.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-_AMAN-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 6300.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_RAVI",
    "name": "Ravi Kumar",
    "email": "ravi.kumar@example.in",
    "phone": "+91 98480 98765",
    "location": "Hyderabad, Telangana",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 6,
    "previous_abandonments": 2,
    "lifetime_orders": 8,
    "lifetime_value": 45000.0,
    "lifetime_cart_value": 59400.0,
    "average_order_value": 7500.0,
    "total_sessions": 10,
    "total_recovered_spent": 9900.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.04,
    "cancellation_rate": 0.01,
    "preferred_payment_method": "Debit Card",
    "preferred_channel": "SMS",
    "risk_score": 45.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-_RAVI-201",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 8625.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-_RAVI-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Debit Card",
        "cart_value": 7125.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-_RAVI-203",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 7875.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_RAVI",
      "name": "Ravi Kumar",
      "email": "ravi.kumar@example.in",
      "phone": "+91 98480 98765",
      "location": "Hyderabad, Telangana",
      "customer_segment": "Regular",
      "lifetime_orders": 6,
      "lifetime_value": 45000.0,
      "average_order_value": 7500.0,
      "return_rate_pct": 4.0,
      "preferred_payment_method": "Debit Card",
      "preferred_channel": "SMS"
    },
    "unified_revenue_risk": {
      "composite_score": 45.0,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 50.0,
      "return_risk": 10.0,
      "rto_risk": 2.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "TECHNICAL_RETRY",
      "priority": "HIGH",
      "channel": "SMS",
      "expected_revenue": 9000.0,
      "expected_profit": 2880.0,
      "economic_rationale": "Encountered payment gateway friction; send seamless Razorpay 1-click re-attempt link."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-RAVI-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 7500.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-RAVI-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 6375.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-_RAVI-201",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 8625.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-_RAVI-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Debit Card",
          "cart_value": 7125.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-_RAVI-203",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 7875.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_NEHA",
    "name": "Neha Gupta",
    "email": "neha.gupta@example.in",
    "phone": "+91 98200 11223",
    "location": "Mumbai, Maharashtra",
    "customer_segment": "VIP",
    "segment": "VIP",
    "is_returning": true,
    "previous_orders": 22,
    "previous_abandonments": 1,
    "lifetime_orders": 24,
    "lifetime_value": 480000.0,
    "lifetime_cart_value": 633600.0,
    "average_order_value": 21818.0,
    "total_sessions": 26,
    "total_recovered_spent": 182400.0,
    "total_abandonments_recorded": 1,
    "return_rate": 0.05,
    "cancellation_rate": 0.02,
    "preferred_payment_method": "Credit Card",
    "preferred_channel": "WHATSAPP",
    "risk_score": 24.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-_NEHA-201",
        "device": "Mobile (iOS)",
        "payment_method": "Credit Card",
        "cart_value": 25090.7,
        "shipping_cost": 0.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-_NEHA-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Credit Card",
        "cart_value": 20727.1,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-_NEHA-203",
        "device": "Mobile (Android)",
        "payment_method": "Credit Card",
        "cart_value": 22908.9,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_NEHA",
      "name": "Neha Gupta",
      "email": "neha.gupta@example.in",
      "phone": "+91 98200 11223",
      "location": "Mumbai, Maharashtra",
      "customer_segment": "VIP",
      "lifetime_orders": 22,
      "lifetime_value": 480000.0,
      "average_order_value": 21818.0,
      "return_rate_pct": 5.0,
      "preferred_payment_method": "Credit Card",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 24.0,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 25.0,
      "return_risk": 12.5,
      "rto_risk": 4.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "VIP_CONCIERGE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 26181.6,
      "expected_profit": 8378.11,
      "economic_rationale": "Ultra high-value luxury buyer; provide white-glove WhatsApp support and instant checkout."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-NEHA-891",
          "product_name": "Premium Electronics & Smart Home",
          "category": "Electronics",
          "order_value": 21818.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-NEHA-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 18545.3,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-_NEHA-201",
          "device": "Mobile (iOS)",
          "payment_method": "Credit Card",
          "cart_value": 25090.7,
          "shipping_cost": 0.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-_NEHA-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Credit Card",
          "cart_value": 20727.1,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-_NEHA-203",
          "device": "Mobile (Android)",
          "payment_method": "Credit Card",
          "cart_value": 22908.9,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_KAVITA",
    "name": "Kavita Iyer",
    "email": "kavita.iyer@example.in",
    "phone": "+91 98230 45678",
    "location": "Pune, Maharashtra",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 7,
    "previous_abandonments": 2,
    "lifetime_orders": 9,
    "lifetime_value": 58000.0,
    "lifetime_cart_value": 76560.0,
    "average_order_value": 8285.0,
    "total_sessions": 11,
    "total_recovered_spent": 12760.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.28,
    "cancellation_rate": 0.02,
    "preferred_payment_method": "UPI",
    "preferred_channel": "WHATSAPP",
    "risk_score": 58.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-AVITA-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 9527.75,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-AVITA-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 7870.75,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-AVITA-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 8699.25,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_KAVITA",
      "name": "Kavita Iyer",
      "email": "kavita.iyer@example.in",
      "phone": "+91 98230 45678",
      "location": "Pune, Maharashtra",
      "customer_segment": "Regular",
      "lifetime_orders": 7,
      "lifetime_value": 58000.0,
      "average_order_value": 8285.0,
      "return_rate_pct": 28.0,
      "preferred_payment_method": "UPI",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 58.0,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 50.0,
      "return_risk": 70.0,
      "rto_risk": 4.0,
      "fraud_risk": 65.0,
      "sentiment_friction_risk": 55.0
    },
    "next_best_action": {
      "recommended_action": "SIZING_CONSULTATION",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 9942.0,
      "expected_profit": 3181.44,
      "economic_rationale": "High sizing return tendency in apparel; activate automated fit consultation before shipment."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-VITA-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 8285.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-VITA-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 7042.25,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-AVITA-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 9527.75,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-AVITA-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 7870.75,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-AVITA-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 8699.25,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-VITA-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 3314.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_VIKAS",
    "name": "Vikas Dubey",
    "email": "vikas.dubey@example.in",
    "phone": "+91 94150 88776",
    "location": "Kanpur, Uttar Pradesh",
    "customer_segment": "New",
    "segment": "New",
    "is_returning": false,
    "previous_orders": 1,
    "previous_abandonments": 1,
    "lifetime_orders": 1,
    "lifetime_value": 8500.0,
    "lifetime_cart_value": 11220.0,
    "average_order_value": 8500.0,
    "total_sessions": 4,
    "total_recovered_spent": 1870.0,
    "total_abandonments_recorded": 1,
    "return_rate": 0.05,
    "cancellation_rate": 0.4,
    "preferred_payment_method": "Cash on Delivery",
    "preferred_channel": "WHATSAPP",
    "risk_score": 74.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-VIKAS-201",
        "device": "Mobile (Android)",
        "payment_method": "Cash on Delivery",
        "cart_value": 9775.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-VIKAS-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Cash on Delivery",
        "cart_value": 8075.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-VIKAS-203",
        "device": "Mobile (Android)",
        "payment_method": "Cash on Delivery",
        "cart_value": 8925.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_VIKAS",
      "name": "Vikas Dubey",
      "email": "vikas.dubey@example.in",
      "phone": "+91 94150 88776",
      "location": "Kanpur, Uttar Pradesh",
      "customer_segment": "New",
      "lifetime_orders": 1,
      "lifetime_value": 8500.0,
      "average_order_value": 8500.0,
      "return_rate_pct": 5.0,
      "preferred_payment_method": "Cash on Delivery",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 74.0,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 25.0,
      "return_risk": 12.5,
      "rto_risk": 80.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "PREPAY_INCENTIVE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 10200.0,
      "expected_profit": 3264.0,
      "economic_rationale": "Tier-2 COD delivery risk; incentivize digital prepayment with \u20b9150 UPI cashback."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-IKAS-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 8500.0,
          "payment_method": "Cash on Delivery",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-IKAS-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 7225.0,
          "payment_method": "Cash on Delivery",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-VIKAS-201",
          "device": "Mobile (Android)",
          "payment_method": "Cash on Delivery",
          "cart_value": 9775.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-VIKAS-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Cash on Delivery",
          "cart_value": 8075.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-VIKAS-203",
          "device": "Mobile (Android)",
          "payment_method": "Cash on Delivery",
          "cart_value": 8925.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_VIKRAM",
    "name": "Vikram Singh",
    "email": "vikram.singh@example.in",
    "phone": "+91 94310 77889",
    "location": "Patna, Bihar",
    "customer_segment": "Occasional",
    "segment": "Occasional",
    "is_returning": true,
    "previous_orders": 3,
    "previous_abandonments": 2,
    "lifetime_orders": 4,
    "lifetime_value": 14500.0,
    "lifetime_cart_value": 19140.0,
    "average_order_value": 4833.0,
    "total_sessions": 7,
    "total_recovered_spent": 3190.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.1,
    "cancellation_rate": 0.35,
    "preferred_payment_method": "Cash on Delivery",
    "preferred_channel": "WHATSAPP",
    "risk_score": 68.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-IKRAM-201",
        "device": "Mobile (Android)",
        "payment_method": "Cash on Delivery",
        "cart_value": 5557.95,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-IKRAM-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Cash on Delivery",
        "cart_value": 4591.35,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-IKRAM-203",
        "device": "Mobile (Android)",
        "payment_method": "Cash on Delivery",
        "cart_value": 5074.65,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_VIKRAM",
      "name": "Vikram Singh",
      "email": "vikram.singh@example.in",
      "phone": "+91 94310 77889",
      "location": "Patna, Bihar",
      "customer_segment": "Occasional",
      "lifetime_orders": 3,
      "lifetime_value": 14500.0,
      "average_order_value": 4833.0,
      "return_rate_pct": 10.0,
      "preferred_payment_method": "Cash on Delivery",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 68.0,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 50.0,
      "return_risk": 25.0,
      "rto_risk": 70.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "WHATSAPP_ADDRESS_CONFIRM",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 5799.6,
      "expected_profit": 1855.87,
      "economic_rationale": "High RTO pincode with incomplete address line; request WhatsApp location pin."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-KRAM-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 4833.0,
          "payment_method": "Cash on Delivery",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-KRAM-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 4108.05,
          "payment_method": "Cash on Delivery",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-IKRAM-201",
          "device": "Mobile (Android)",
          "payment_method": "Cash on Delivery",
          "cart_value": 5557.95,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-IKRAM-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Cash on Delivery",
          "cart_value": 4591.35,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-IKRAM-203",
          "device": "Mobile (Android)",
          "payment_method": "Cash on Delivery",
          "cart_value": 5074.65,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_ANANYA",
    "name": "Ananya Roy",
    "email": "ananya.roy@example.in",
    "phone": "+91 98300 33445",
    "location": "Kolkata, West Bengal",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 9,
    "previous_abandonments": 3,
    "lifetime_orders": 11,
    "lifetime_value": 72000.0,
    "lifetime_cart_value": 95040.0,
    "average_order_value": 8000.0,
    "total_sessions": 14,
    "total_recovered_spent": 15840.0,
    "total_abandonments_recorded": 3,
    "return_rate": 0.32,
    "cancellation_rate": 0.03,
    "preferred_payment_method": "UPI",
    "preferred_channel": "WHATSAPP",
    "risk_score": 64.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-NANYA-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 9200.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-NANYA-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 7600.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-NANYA-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 8400.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_ANANYA",
      "name": "Ananya Roy",
      "email": "ananya.roy@example.in",
      "phone": "+91 98300 33445",
      "location": "Kolkata, West Bengal",
      "customer_segment": "Regular",
      "lifetime_orders": 9,
      "lifetime_value": 72000.0,
      "average_order_value": 8000.0,
      "return_rate_pct": 32.0,
      "preferred_payment_method": "UPI",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 64.0,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 75.0,
      "return_risk": 80.0,
      "rto_risk": 6.0,
      "fraud_risk": 65.0,
      "sentiment_friction_risk": 55.0
    },
    "next_best_action": {
      "recommended_action": "SIZING_CONSULTATION",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 9600.0,
      "expected_profit": 3072.0,
      "economic_rationale": "Repeated bracketing (purchasing multiple sizes); trigger pre-dispatch size check."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-ANYA-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 8000.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-ANYA-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 6800.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-NANYA-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 9200.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-NANYA-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 7600.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-NANYA-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 8400.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-ANYA-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 3200.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_KABIR",
    "name": "Kabir Mehta",
    "email": "kabir.mehta@example.in",
    "phone": "+91 98790 66554",
    "location": "Ahmedabad, Gujarat",
    "customer_segment": "New",
    "segment": "New",
    "is_returning": false,
    "previous_orders": 1,
    "previous_abandonments": 2,
    "lifetime_orders": 2,
    "lifetime_value": 4500.0,
    "lifetime_cart_value": 5940.0,
    "average_order_value": 4500.0,
    "total_sessions": 5,
    "total_recovered_spent": 990.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.05,
    "cancellation_rate": 0.05,
    "preferred_payment_method": "Credit Card",
    "preferred_channel": "WHATSAPP",
    "risk_score": 52.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-KABIR-201",
        "device": "Mobile (Android)",
        "payment_method": "Credit Card",
        "cart_value": 5175.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-KABIR-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Credit Card",
        "cart_value": 4275.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-KABIR-203",
        "device": "Mobile (Android)",
        "payment_method": "Credit Card",
        "cart_value": 4725.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_KABIR",
      "name": "Kabir Mehta",
      "email": "kabir.mehta@example.in",
      "phone": "+91 98790 66554",
      "location": "Ahmedabad, Gujarat",
      "customer_segment": "New",
      "lifetime_orders": 1,
      "lifetime_value": 4500.0,
      "average_order_value": 4500.0,
      "return_rate_pct": 5.0,
      "preferred_payment_method": "Credit Card",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 52.0,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 50.0,
      "return_risk": 12.5,
      "rto_risk": 10.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 5400.0,
      "expected_profit": 1728.0,
      "economic_rationale": "First-time visitor showing high intent; eliminate delivery fee barrier."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-ABIR-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 4500.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-ABIR-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 3825.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-KABIR-201",
          "device": "Mobile (Android)",
          "payment_method": "Credit Card",
          "cart_value": 5175.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-KABIR-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Credit Card",
          "cart_value": 4275.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-KABIR-203",
          "device": "Mobile (Android)",
          "payment_method": "Credit Card",
          "cart_value": 4725.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "DEMO_CUST_POOJA",
    "name": "Pooja Mishra",
    "email": "pooja.mishra@example.in",
    "phone": "+91 94150 99887",
    "location": "Lucknow, Uttar Pradesh",
    "customer_segment": "New",
    "segment": "New",
    "is_returning": false,
    "previous_orders": 1,
    "previous_abandonments": 0,
    "lifetime_orders": 1,
    "lifetime_value": 3500.0,
    "lifetime_cart_value": 4620.0,
    "average_order_value": 3500.0,
    "total_sessions": 3,
    "total_recovered_spent": 770.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.05,
    "cancellation_rate": 0.02,
    "preferred_payment_method": "UPI",
    "preferred_channel": "EMAIL",
    "risk_score": 18.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-POOJA-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 4025.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-POOJA-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 3325.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-POOJA-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 3675.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "DEMO_CUST_POOJA",
      "name": "Pooja Mishra",
      "email": "pooja.mishra@example.in",
      "phone": "+91 94150 99887",
      "location": "Lucknow, Uttar Pradesh",
      "customer_segment": "New",
      "lifetime_orders": 1,
      "lifetime_value": 3500.0,
      "average_order_value": 3500.0,
      "return_rate_pct": 5.0,
      "preferred_payment_method": "UPI",
      "preferred_channel": "EMAIL"
    },
    "unified_revenue_risk": {
      "composite_score": 18.0,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 0.0,
      "return_risk": 12.5,
      "rto_risk": 4.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "WELCOME_DISCOUNT",
      "priority": "HIGH",
      "channel": "EMAIL",
      "expected_revenue": 4200.0,
      "expected_profit": 1344.0,
      "economic_rationale": "New onboarding customer; nurture second purchase with 5% welcome credit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-OOJA-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 3500.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-OOJA-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 2975.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-POOJA-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 4025.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-POOJA-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 3325.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-POOJA-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 3675.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_135035",
    "name": "Diya Mehta",
    "email": "diya.mehta337@gmail.com",
    "phone": "+91 8933 10022",
    "location": "Indore",
    "customer_segment": "VIP",
    "segment": "VIP",
    "is_returning": true,
    "previous_orders": 34,
    "previous_abandonments": 1,
    "lifetime_orders": 39,
    "lifetime_value": 936000.0,
    "lifetime_cart_value": 1235520.0,
    "average_order_value": 24000.0,
    "total_sessions": 38,
    "total_recovered_spent": 355680.0,
    "total_abandonments_recorded": 1,
    "return_rate": 0.0409,
    "cancellation_rate": 0.0159,
    "preferred_payment_method": "Debit Card",
    "preferred_channel": "WHATSAPP",
    "risk_score": 42.7,
    "recent_sessions": [
      {
        "checkout_id": "CHK-35035-201",
        "device": "Mobile (iOS)",
        "payment_method": "Debit Card",
        "cart_value": 27600.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-35035-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Debit Card",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-35035-203",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_135035",
      "name": "Diya Mehta",
      "email": "diya.mehta337@gmail.com",
      "phone": "+91 8933 10022",
      "location": "Indore",
      "customer_segment": "VIP",
      "lifetime_orders": 34,
      "lifetime_value": 936000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 4.1,
      "preferred_payment_method": "Debit Card",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 42.7,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 25.0,
      "return_risk": 10.2,
      "rto_risk": 3.2,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "VIP_CONCIERGE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High lifetime value VIP customer; proactively assign priority concierge."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-5035-891",
          "product_name": "Premium Electronics & Smart Home",
          "category": "Electronics",
          "order_value": 24000.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-5035-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-35035-201",
          "device": "Mobile (iOS)",
          "payment_method": "Debit Card",
          "cart_value": 27600.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-35035-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Debit Card",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-35035-203",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_112241",
    "name": "Ishaan Deshmukh",
    "email": "ishaan.deshmukh662@gmail.com",
    "phone": "+91 7884 19423",
    "location": "Ahmedabad",
    "customer_segment": "VIP",
    "segment": "VIP",
    "is_returning": true,
    "previous_orders": 34,
    "previous_abandonments": 1,
    "lifetime_orders": 39,
    "lifetime_value": 936000.0,
    "lifetime_cart_value": 1235520.0,
    "average_order_value": 24000.0,
    "total_sessions": 38,
    "total_recovered_spent": 355680.0,
    "total_abandonments_recorded": 1,
    "return_rate": 0.0597,
    "cancellation_rate": 0.1347,
    "preferred_payment_method": "Credit Card",
    "preferred_channel": "WHATSAPP",
    "risk_score": 57.4,
    "recent_sessions": [
      {
        "checkout_id": "CHK-12241-201",
        "device": "Mobile (iOS)",
        "payment_method": "Credit Card",
        "cart_value": 27600.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-12241-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Credit Card",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-12241-203",
        "device": "Mobile (Android)",
        "payment_method": "Credit Card",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_112241",
      "name": "Ishaan Deshmukh",
      "email": "ishaan.deshmukh662@gmail.com",
      "phone": "+91 7884 19423",
      "location": "Ahmedabad",
      "customer_segment": "VIP",
      "lifetime_orders": 34,
      "lifetime_value": 936000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 6.0,
      "preferred_payment_method": "Credit Card",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 57.4,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 25.0,
      "return_risk": 14.9,
      "rto_risk": 26.9,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "VIP_CONCIERGE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High lifetime value VIP customer; proactively assign priority concierge."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-2241-891",
          "product_name": "Premium Electronics & Smart Home",
          "category": "Electronics",
          "order_value": 24000.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-2241-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-12241-201",
          "device": "Mobile (iOS)",
          "payment_method": "Credit Card",
          "cart_value": 27600.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-12241-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Credit Card",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-12241-203",
          "device": "Mobile (Android)",
          "payment_method": "Credit Card",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_116103",
    "name": "Pooja Singh",
    "email": "pooja.singh820@gmail.com",
    "phone": "+91 8990 82697",
    "location": "Jaipur",
    "customer_segment": "VIP",
    "segment": "VIP",
    "is_returning": true,
    "previous_orders": 34,
    "previous_abandonments": 2,
    "lifetime_orders": 39,
    "lifetime_value": 936000.0,
    "lifetime_cart_value": 1235520.0,
    "average_order_value": 24000.0,
    "total_sessions": 39,
    "total_recovered_spent": 355680.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.3511,
    "cancellation_rate": 0.0593,
    "preferred_payment_method": "UPI",
    "preferred_channel": "WHATSAPP",
    "risk_score": 92.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-16103-201",
        "device": "Mobile (iOS)",
        "payment_method": "UPI",
        "cart_value": 27600.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-16103-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-16103-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_116103",
      "name": "Pooja Singh",
      "email": "pooja.singh820@gmail.com",
      "phone": "+91 8990 82697",
      "location": "Jaipur",
      "customer_segment": "VIP",
      "lifetime_orders": 34,
      "lifetime_value": 936000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 35.1,
      "preferred_payment_method": "UPI",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 92.0,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 50.0,
      "return_risk": 87.8,
      "rto_risk": 11.9,
      "fraud_risk": 65.0,
      "sentiment_friction_risk": 55.0
    },
    "next_best_action": {
      "recommended_action": "VIP_CONCIERGE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High lifetime value VIP customer; proactively assign priority concierge."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-6103-891",
          "product_name": "Premium Electronics & Smart Home",
          "category": "Electronics",
          "order_value": 24000.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-6103-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-16103-201",
          "device": "Mobile (iOS)",
          "payment_method": "UPI",
          "cart_value": 27600.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-16103-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-16103-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-6103-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_137449",
    "name": "Simran Chawla",
    "email": "simran.chawla801@gmail.com",
    "phone": "+91 8142 87530",
    "location": "Kochi",
    "customer_segment": "VIP",
    "segment": "VIP",
    "is_returning": true,
    "previous_orders": 34,
    "previous_abandonments": 0,
    "lifetime_orders": 39,
    "lifetime_value": 936000.0,
    "lifetime_cart_value": 1235520.0,
    "average_order_value": 24000.0,
    "total_sessions": 37,
    "total_recovered_spent": 355680.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.1006,
    "cancellation_rate": 0.063,
    "preferred_payment_method": "COD",
    "preferred_channel": "WHATSAPP",
    "risk_score": 36.4,
    "recent_sessions": [
      {
        "checkout_id": "CHK-37449-201",
        "device": "Mobile (iOS)",
        "payment_method": "COD",
        "cart_value": 27600.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-37449-202",
        "device": "Desktop (Chrome)",
        "payment_method": "COD",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-37449-203",
        "device": "Mobile (Android)",
        "payment_method": "COD",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_137449",
      "name": "Simran Chawla",
      "email": "simran.chawla801@gmail.com",
      "phone": "+91 8142 87530",
      "location": "Kochi",
      "customer_segment": "VIP",
      "lifetime_orders": 34,
      "lifetime_value": 936000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 10.1,
      "preferred_payment_method": "COD",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 36.4,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 0.0,
      "return_risk": 25.1,
      "rto_risk": 12.6,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "VIP_CONCIERGE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High lifetime value VIP customer; proactively assign priority concierge."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-7449-891",
          "product_name": "Premium Electronics & Smart Home",
          "category": "Electronics",
          "order_value": 24000.0,
          "payment_method": "COD",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-7449-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "COD",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-37449-201",
          "device": "Mobile (iOS)",
          "payment_method": "COD",
          "cart_value": 27600.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-37449-202",
          "device": "Desktop (Chrome)",
          "payment_method": "COD",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-37449-203",
          "device": "Mobile (Android)",
          "payment_method": "COD",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-7449-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_126510",
    "name": "Simran Singh",
    "email": "simran.singh615@gmail.com",
    "phone": "+91 8569 46591",
    "location": "Mumbai",
    "customer_segment": "VIP",
    "segment": "VIP",
    "is_returning": true,
    "previous_orders": 34,
    "previous_abandonments": 0,
    "lifetime_orders": 38,
    "lifetime_value": 912000.0,
    "lifetime_cart_value": 1203840.0,
    "average_order_value": 24000.0,
    "total_sessions": 37,
    "total_recovered_spent": 346560.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.0648,
    "cancellation_rate": 0.0983,
    "preferred_payment_method": "UPI",
    "preferred_channel": "WHATSAPP",
    "risk_score": 34.5,
    "recent_sessions": [
      {
        "checkout_id": "CHK-26510-201",
        "device": "Mobile (iOS)",
        "payment_method": "UPI",
        "cart_value": 27600.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-26510-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-26510-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_126510",
      "name": "Simran Singh",
      "email": "simran.singh615@gmail.com",
      "phone": "+91 8569 46591",
      "location": "Mumbai",
      "customer_segment": "VIP",
      "lifetime_orders": 34,
      "lifetime_value": 912000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 6.5,
      "preferred_payment_method": "UPI",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 34.5,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 0.0,
      "return_risk": 16.2,
      "rto_risk": 19.7,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "VIP_CONCIERGE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High lifetime value VIP customer; proactively assign priority concierge."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-6510-891",
          "product_name": "Premium Electronics & Smart Home",
          "category": "Electronics",
          "order_value": 24000.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-6510-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-26510-201",
          "device": "Mobile (iOS)",
          "payment_method": "UPI",
          "cart_value": 27600.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-26510-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-26510-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_129418",
    "name": "Varun Chawla",
    "email": "varun.chawla735@gmail.com",
    "phone": "+91 7187 52717",
    "location": "Guwahati",
    "customer_segment": "VIP",
    "segment": "VIP",
    "is_returning": true,
    "previous_orders": 34,
    "previous_abandonments": 2,
    "lifetime_orders": 38,
    "lifetime_value": 912000.0,
    "lifetime_cart_value": 1203840.0,
    "average_order_value": 24000.0,
    "total_sessions": 39,
    "total_recovered_spent": 346560.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.0197,
    "cancellation_rate": 0.0183,
    "preferred_payment_method": "Debit Card",
    "preferred_channel": "WHATSAPP",
    "risk_score": 59.8,
    "recent_sessions": [
      {
        "checkout_id": "CHK-29418-201",
        "device": "Mobile (iOS)",
        "payment_method": "Debit Card",
        "cart_value": 27600.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-29418-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Debit Card",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-29418-203",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_129418",
      "name": "Varun Chawla",
      "email": "varun.chawla735@gmail.com",
      "phone": "+91 7187 52717",
      "location": "Guwahati",
      "customer_segment": "VIP",
      "lifetime_orders": 34,
      "lifetime_value": 912000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 2.0,
      "preferred_payment_method": "Debit Card",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 59.8,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 50.0,
      "return_risk": 4.9,
      "rto_risk": 3.7,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "VIP_CONCIERGE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High lifetime value VIP customer; proactively assign priority concierge."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-9418-891",
          "product_name": "Premium Electronics & Smart Home",
          "category": "Electronics",
          "order_value": 24000.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-9418-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-29418-201",
          "device": "Mobile (iOS)",
          "payment_method": "Debit Card",
          "cart_value": 27600.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-29418-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Debit Card",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-29418-203",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_122445",
    "name": "Siddharth Kapoor",
    "email": "siddharth.kapoor995@gmail.com",
    "phone": "+91 8466 20364",
    "location": "Delhi",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 9,
    "previous_abandonments": 1,
    "lifetime_orders": 14,
    "lifetime_value": 336000.0,
    "lifetime_cart_value": 443520.0,
    "average_order_value": 24000.0,
    "total_sessions": 12,
    "total_recovered_spent": 73920.0,
    "total_abandonments_recorded": 1,
    "return_rate": 0.1,
    "cancellation_rate": 0.0037,
    "preferred_payment_method": "UPI",
    "preferred_channel": "WHATSAPP",
    "risk_score": 50.4,
    "recent_sessions": [
      {
        "checkout_id": "CHK-22445-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-22445-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-22445-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_122445",
      "name": "Siddharth Kapoor",
      "email": "siddharth.kapoor995@gmail.com",
      "phone": "+91 8466 20364",
      "location": "Delhi",
      "customer_segment": "Regular",
      "lifetime_orders": 9,
      "lifetime_value": 336000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 10.0,
      "preferred_payment_method": "UPI",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 50.4,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 25.0,
      "return_risk": 25.0,
      "rto_risk": 0.7,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-2445-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-2445-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-22445-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-22445-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-22445-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_127582",
    "name": "Pranav Gupta",
    "email": "pranav.gupta617@gmail.com",
    "phone": "+91 9831 58176",
    "location": "Bhopal",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 9,
    "previous_abandonments": 1,
    "lifetime_orders": 14,
    "lifetime_value": 336000.0,
    "lifetime_cart_value": 443520.0,
    "average_order_value": 24000.0,
    "total_sessions": 12,
    "total_recovered_spent": 73920.0,
    "total_abandonments_recorded": 1,
    "return_rate": 0.049,
    "cancellation_rate": 0.0478,
    "preferred_payment_method": "Credit Card",
    "preferred_channel": "WHATSAPP",
    "risk_score": 47.1,
    "recent_sessions": [
      {
        "checkout_id": "CHK-27582-201",
        "device": "Mobile (Android)",
        "payment_method": "Credit Card",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-27582-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Credit Card",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-27582-203",
        "device": "Mobile (Android)",
        "payment_method": "Credit Card",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_127582",
      "name": "Pranav Gupta",
      "email": "pranav.gupta617@gmail.com",
      "phone": "+91 9831 58176",
      "location": "Bhopal",
      "customer_segment": "Regular",
      "lifetime_orders": 9,
      "lifetime_value": 336000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 4.9,
      "preferred_payment_method": "Credit Card",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 47.1,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 25.0,
      "return_risk": 12.2,
      "rto_risk": 9.6,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-7582-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-7582-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-27582-201",
          "device": "Mobile (Android)",
          "payment_method": "Credit Card",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-27582-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Credit Card",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-27582-203",
          "device": "Mobile (Android)",
          "payment_method": "Credit Card",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_115090",
    "name": "Sneha Iyer",
    "email": "sneha.iyer710@gmail.com",
    "phone": "+91 7257 12977",
    "location": "Indore",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 9,
    "previous_abandonments": 2,
    "lifetime_orders": 14,
    "lifetime_value": 336000.0,
    "lifetime_cart_value": 443520.0,
    "average_order_value": 24000.0,
    "total_sessions": 13,
    "total_recovered_spent": 73920.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.1316,
    "cancellation_rate": 0.033,
    "preferred_payment_method": "Debit Card",
    "preferred_channel": "WHATSAPP",
    "risk_score": 78.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-15090-201",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-15090-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Debit Card",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-15090-203",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_115090",
      "name": "Sneha Iyer",
      "email": "sneha.iyer710@gmail.com",
      "phone": "+91 7257 12977",
      "location": "Indore",
      "customer_segment": "Regular",
      "lifetime_orders": 9,
      "lifetime_value": 336000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 13.2,
      "preferred_payment_method": "Debit Card",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 78.0,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 50.0,
      "return_risk": 32.9,
      "rto_risk": 6.6,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-5090-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-5090-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-15090-201",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-15090-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Debit Card",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-15090-203",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-5090-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_134920",
    "name": "Nisha Bose",
    "email": "nisha.bose161@gmail.com",
    "phone": "+91 7453 20819",
    "location": "Jaipur",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 9,
    "previous_abandonments": 0,
    "lifetime_orders": 14,
    "lifetime_value": 336000.0,
    "lifetime_cart_value": 443520.0,
    "average_order_value": 24000.0,
    "total_sessions": 11,
    "total_recovered_spent": 73920.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.0309,
    "cancellation_rate": 0.1235,
    "preferred_payment_method": "COD",
    "preferred_channel": "WHATSAPP",
    "risk_score": 32.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-34920-201",
        "device": "Mobile (Android)",
        "payment_method": "COD",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-34920-202",
        "device": "Desktop (Chrome)",
        "payment_method": "COD",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-34920-203",
        "device": "Mobile (Android)",
        "payment_method": "COD",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_134920",
      "name": "Nisha Bose",
      "email": "nisha.bose161@gmail.com",
      "phone": "+91 7453 20819",
      "location": "Jaipur",
      "customer_segment": "Regular",
      "lifetime_orders": 9,
      "lifetime_value": 336000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 3.1,
      "preferred_payment_method": "COD",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 32.0,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 0.0,
      "return_risk": 7.7,
      "rto_risk": 24.7,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-4920-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "COD",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-4920-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "COD",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-34920-201",
          "device": "Mobile (Android)",
          "payment_method": "COD",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-34920-202",
          "device": "Desktop (Chrome)",
          "payment_method": "COD",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-34920-203",
          "device": "Mobile (Android)",
          "payment_method": "COD",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_124231",
    "name": "Dev Deshmukh",
    "email": "dev.deshmukh891@gmail.com",
    "phone": "+91 8484 51593",
    "location": "Mumbai",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 9,
    "previous_abandonments": 4,
    "lifetime_orders": 14,
    "lifetime_value": 336000.0,
    "lifetime_cart_value": 443520.0,
    "average_order_value": 24000.0,
    "total_sessions": 15,
    "total_recovered_spent": 73920.0,
    "total_abandonments_recorded": 4,
    "return_rate": 0.1399,
    "cancellation_rate": 0.1091,
    "preferred_payment_method": "UPI",
    "preferred_channel": "WHATSAPP",
    "risk_score": 92.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-24231-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-24231-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-24231-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_124231",
      "name": "Dev Deshmukh",
      "email": "dev.deshmukh891@gmail.com",
      "phone": "+91 8484 51593",
      "location": "Mumbai",
      "customer_segment": "Regular",
      "lifetime_orders": 9,
      "lifetime_value": 336000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 14.0,
      "preferred_payment_method": "UPI",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 92.0,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 90.0,
      "return_risk": 35.0,
      "rto_risk": 21.8,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-4231-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-4231-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-24231-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-24231-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-24231-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-4231-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_106761",
    "name": "Karan Bose",
    "email": "karan.bose469@gmail.com",
    "phone": "+91 7814 67883",
    "location": "Lucknow",
    "customer_segment": "Regular",
    "segment": "Regular",
    "is_returning": true,
    "previous_orders": 9,
    "previous_abandonments": 2,
    "lifetime_orders": 14,
    "lifetime_value": 336000.0,
    "lifetime_cart_value": 443520.0,
    "average_order_value": 24000.0,
    "total_sessions": 13,
    "total_recovered_spent": 73920.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.0771,
    "cancellation_rate": 0.1604,
    "preferred_payment_method": "COD",
    "preferred_channel": "WHATSAPP",
    "risk_score": 82.6,
    "recent_sessions": [
      {
        "checkout_id": "CHK-06761-201",
        "device": "Mobile (Android)",
        "payment_method": "COD",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-06761-202",
        "device": "Desktop (Chrome)",
        "payment_method": "COD",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-06761-203",
        "device": "Mobile (Android)",
        "payment_method": "COD",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_106761",
      "name": "Karan Bose",
      "email": "karan.bose469@gmail.com",
      "phone": "+91 7814 67883",
      "location": "Lucknow",
      "customer_segment": "Regular",
      "lifetime_orders": 9,
      "lifetime_value": 336000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 7.7,
      "preferred_payment_method": "COD",
      "preferred_channel": "WHATSAPP"
    },
    "unified_revenue_risk": {
      "composite_score": 82.6,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 50.0,
      "return_risk": 19.3,
      "rto_risk": 32.1,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "PREPAY_INCENTIVE",
      "priority": "HIGH",
      "channel": "WHATSAPP",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Elevated cancellation history; incentivize prepayment on COD orders."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-6761-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "COD",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-6761-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "COD",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-06761-201",
          "device": "Mobile (Android)",
          "payment_method": "COD",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-06761-202",
          "device": "Desktop (Chrome)",
          "payment_method": "COD",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-06761-203",
          "device": "Mobile (Android)",
          "payment_method": "COD",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_102473",
    "name": "Meera Kumar",
    "email": "meera.kumar732@gmail.com",
    "phone": "+91 9173 51126",
    "location": "Kolkata",
    "customer_segment": "Occasional",
    "segment": "Occasional",
    "is_returning": false,
    "previous_orders": 3,
    "previous_abandonments": 2,
    "lifetime_orders": 8,
    "lifetime_value": 192000.0,
    "lifetime_cart_value": 253440.0,
    "average_order_value": 24000.0,
    "total_sessions": 7,
    "total_recovered_spent": 42240.0,
    "total_abandonments_recorded": 2,
    "return_rate": 0.0725,
    "cancellation_rate": 0.0172,
    "preferred_payment_method": "Net Banking",
    "preferred_channel": "EMAIL",
    "risk_score": 67.6,
    "recent_sessions": [
      {
        "checkout_id": "CHK-02473-201",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-02473-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Net Banking",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-02473-203",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_102473",
      "name": "Meera Kumar",
      "email": "meera.kumar732@gmail.com",
      "phone": "+91 9173 51126",
      "location": "Kolkata",
      "customer_segment": "Occasional",
      "lifetime_orders": 3,
      "lifetime_value": 192000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 7.2,
      "preferred_payment_method": "Net Banking",
      "preferred_channel": "EMAIL"
    },
    "unified_revenue_risk": {
      "composite_score": 67.6,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 50.0,
      "return_risk": 18.1,
      "rto_risk": 3.4,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "EMAIL",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-2473-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-2473-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-02473-201",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-02473-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Net Banking",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-02473-203",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_131354",
    "name": "Gaurav Bose",
    "email": "gaurav.bose803@gmail.com",
    "phone": "+91 7532 61802",
    "location": "Guwahati",
    "customer_segment": "Occasional",
    "segment": "Occasional",
    "is_returning": true,
    "previous_orders": 3,
    "previous_abandonments": 3,
    "lifetime_orders": 8,
    "lifetime_value": 192000.0,
    "lifetime_cart_value": 253440.0,
    "average_order_value": 24000.0,
    "total_sessions": 8,
    "total_recovered_spent": 42240.0,
    "total_abandonments_recorded": 3,
    "return_rate": 0.2604,
    "cancellation_rate": 0.0244,
    "preferred_payment_method": "UPI",
    "preferred_channel": "EMAIL",
    "risk_score": 92.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-31354-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-31354-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-31354-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_131354",
      "name": "Gaurav Bose",
      "email": "gaurav.bose803@gmail.com",
      "phone": "+91 7532 61802",
      "location": "Guwahati",
      "customer_segment": "Occasional",
      "lifetime_orders": 3,
      "lifetime_value": 192000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 26.0,
      "preferred_payment_method": "UPI",
      "preferred_channel": "EMAIL"
    },
    "unified_revenue_risk": {
      "composite_score": 92.0,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 75.0,
      "return_risk": 65.1,
      "rto_risk": 4.9,
      "fraud_risk": 65.0,
      "sentiment_friction_risk": 55.0
    },
    "next_best_action": {
      "recommended_action": "SIZING_CONSULTATION",
      "priority": "HIGH",
      "channel": "EMAIL",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High sizing return tendency; activate automated fit consultation."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-1354-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-1354-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-31354-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-31354-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-31354-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-1354-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_125430",
    "name": "Diya Verma",
    "email": "diya.verma591@gmail.com",
    "phone": "+91 8855 94259",
    "location": "Kolkata",
    "customer_segment": "Occasional",
    "segment": "Occasional",
    "is_returning": false,
    "previous_orders": 3,
    "previous_abandonments": 4,
    "lifetime_orders": 8,
    "lifetime_value": 192000.0,
    "lifetime_cart_value": 253440.0,
    "average_order_value": 24000.0,
    "total_sessions": 9,
    "total_recovered_spent": 42240.0,
    "total_abandonments_recorded": 4,
    "return_rate": 0.1194,
    "cancellation_rate": 0.0781,
    "preferred_payment_method": "UPI",
    "preferred_channel": "EMAIL",
    "risk_score": 92.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-25430-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-25430-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-25430-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_125430",
      "name": "Diya Verma",
      "email": "diya.verma591@gmail.com",
      "phone": "+91 8855 94259",
      "location": "Kolkata",
      "customer_segment": "Occasional",
      "lifetime_orders": 3,
      "lifetime_value": 192000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 11.9,
      "preferred_payment_method": "UPI",
      "preferred_channel": "EMAIL"
    },
    "unified_revenue_risk": {
      "composite_score": 92.0,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 90.0,
      "return_risk": 29.9,
      "rto_risk": 15.6,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "EMAIL",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-5430-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-5430-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-25430-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-25430-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-25430-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-5430-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_111076",
    "name": "Kavya Deshmukh",
    "email": "kavya.deshmukh189@gmail.com",
    "phone": "+91 7926 26175",
    "location": "Chandigarh",
    "customer_segment": "Occasional",
    "segment": "Occasional",
    "is_returning": true,
    "previous_orders": 3,
    "previous_abandonments": 3,
    "lifetime_orders": 8,
    "lifetime_value": 192000.0,
    "lifetime_cart_value": 253440.0,
    "average_order_value": 24000.0,
    "total_sessions": 8,
    "total_recovered_spent": 42240.0,
    "total_abandonments_recorded": 3,
    "return_rate": 0.1722,
    "cancellation_rate": 0.0751,
    "preferred_payment_method": "Credit Card",
    "preferred_channel": "EMAIL",
    "risk_score": 92.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-11076-201",
        "device": "Mobile (Android)",
        "payment_method": "Credit Card",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-11076-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Credit Card",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-11076-203",
        "device": "Mobile (Android)",
        "payment_method": "Credit Card",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_111076",
      "name": "Kavya Deshmukh",
      "email": "kavya.deshmukh189@gmail.com",
      "phone": "+91 7926 26175",
      "location": "Chandigarh",
      "customer_segment": "Occasional",
      "lifetime_orders": 3,
      "lifetime_value": 192000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 17.2,
      "preferred_payment_method": "Credit Card",
      "preferred_channel": "EMAIL"
    },
    "unified_revenue_risk": {
      "composite_score": 92.0,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 75.0,
      "return_risk": 43.0,
      "rto_risk": 15.0,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 55.0
    },
    "next_best_action": {
      "recommended_action": "SIZING_CONSULTATION",
      "priority": "HIGH",
      "channel": "EMAIL",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High sizing return tendency; activate automated fit consultation."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-1076-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-1076-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Credit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-11076-201",
          "device": "Mobile (Android)",
          "payment_method": "Credit Card",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-11076-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Credit Card",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-11076-203",
          "device": "Mobile (Android)",
          "payment_method": "Credit Card",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-1076-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_100328",
    "name": "Riya Chawla",
    "email": "riya.chawla89@gmail.com",
    "phone": "+91 8768 22755",
    "location": "Mumbai",
    "customer_segment": "Occasional",
    "segment": "Occasional",
    "is_returning": true,
    "previous_orders": 3,
    "previous_abandonments": 1,
    "lifetime_orders": 8,
    "lifetime_value": 192000.0,
    "lifetime_cart_value": 253440.0,
    "average_order_value": 24000.0,
    "total_sessions": 6,
    "total_recovered_spent": 42240.0,
    "total_abandonments_recorded": 1,
    "return_rate": 0.1094,
    "cancellation_rate": 0.0656,
    "preferred_payment_method": "COD",
    "preferred_channel": "SMS",
    "risk_score": 58.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-00328-201",
        "device": "Mobile (Android)",
        "payment_method": "COD",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-00328-202",
        "device": "Desktop (Chrome)",
        "payment_method": "COD",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-00328-203",
        "device": "Mobile (Android)",
        "payment_method": "COD",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_100328",
      "name": "Riya Chawla",
      "email": "riya.chawla89@gmail.com",
      "phone": "+91 8768 22755",
      "location": "Mumbai",
      "customer_segment": "Occasional",
      "lifetime_orders": 3,
      "lifetime_value": 192000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 10.9,
      "preferred_payment_method": "COD",
      "preferred_channel": "SMS"
    },
    "unified_revenue_risk": {
      "composite_score": 58.0,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 25.0,
      "return_risk": 27.3,
      "rto_risk": 13.1,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "SMS",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-0328-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "COD",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-0328-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "COD",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-00328-201",
          "device": "Mobile (Android)",
          "payment_method": "COD",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-00328-202",
          "device": "Desktop (Chrome)",
          "payment_method": "COD",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-00328-203",
          "device": "Mobile (Android)",
          "payment_method": "COD",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-0328-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_101863",
    "name": "Diya Agarwal",
    "email": "diya.agarwal700@gmail.com",
    "phone": "+91 8354 65702",
    "location": "Lucknow",
    "customer_segment": "Occasional",
    "segment": "Occasional",
    "is_returning": false,
    "previous_orders": 3,
    "previous_abandonments": 5,
    "lifetime_orders": 8,
    "lifetime_value": 192000.0,
    "lifetime_cart_value": 253440.0,
    "average_order_value": 24000.0,
    "total_sessions": 10,
    "total_recovered_spent": 42240.0,
    "total_abandonments_recorded": 5,
    "return_rate": 0.2996,
    "cancellation_rate": 0.0196,
    "preferred_payment_method": "UPI",
    "preferred_channel": "EMAIL",
    "risk_score": 92.0,
    "recent_sessions": [
      {
        "checkout_id": "CHK-01863-201",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "ABANDONED",
        "reason": "SHIPPING"
      },
      {
        "checkout_id": "CHK-01863-202",
        "device": "Desktop (Chrome)",
        "payment_method": "UPI",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-01863-203",
        "device": "Mobile (Android)",
        "payment_method": "UPI",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_101863",
      "name": "Diya Agarwal",
      "email": "diya.agarwal700@gmail.com",
      "phone": "+91 8354 65702",
      "location": "Lucknow",
      "customer_segment": "Occasional",
      "lifetime_orders": 3,
      "lifetime_value": 192000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 30.0,
      "preferred_payment_method": "UPI",
      "preferred_channel": "EMAIL"
    },
    "unified_revenue_risk": {
      "composite_score": 92.0,
      "risk_tier": "CRITICAL",
      "abandonment_risk": 90.0,
      "return_risk": 74.9,
      "rto_risk": 3.9,
      "fraud_risk": 65.0,
      "sentiment_friction_risk": 55.0
    },
    "next_best_action": {
      "recommended_action": "SIZING_CONSULTATION",
      "priority": "HIGH",
      "channel": "EMAIL",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High sizing return tendency; activate automated fit consultation."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-1863-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-1863-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "UPI",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-01863-201",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "ABANDONED",
          "reason": "SHIPPING"
        },
        {
          "checkout_id": "CHK-01863-202",
          "device": "Desktop (Chrome)",
          "payment_method": "UPI",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-01863-203",
          "device": "Mobile (Android)",
          "payment_method": "UPI",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-1863-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_112500",
    "name": "Riya Verma",
    "email": "riya.verma253@gmail.com",
    "phone": "+91 8925 51079",
    "location": "Ahmedabad",
    "customer_segment": "New",
    "segment": "New",
    "is_returning": false,
    "previous_orders": 1,
    "previous_abandonments": 0,
    "lifetime_orders": 5,
    "lifetime_value": 120000.0,
    "lifetime_cart_value": 158400.0,
    "average_order_value": 24000.0,
    "total_sessions": 3,
    "total_recovered_spent": 26400.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.1252,
    "cancellation_rate": 0.0137,
    "preferred_payment_method": "Debit Card",
    "preferred_channel": "EMAIL",
    "risk_score": 35.2,
    "recent_sessions": [
      {
        "checkout_id": "CHK-12500-201",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-12500-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Debit Card",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-12500-203",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_112500",
      "name": "Riya Verma",
      "email": "riya.verma253@gmail.com",
      "phone": "+91 8925 51079",
      "location": "Ahmedabad",
      "customer_segment": "New",
      "lifetime_orders": 1,
      "lifetime_value": 120000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 12.5,
      "preferred_payment_method": "Debit Card",
      "preferred_channel": "EMAIL"
    },
    "unified_revenue_risk": {
      "composite_score": 35.2,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 0.0,
      "return_risk": 31.3,
      "rto_risk": 2.7,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "EMAIL",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-2500-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-2500-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-12500-201",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-12500-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Debit Card",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-12500-203",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-2500-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_139995",
    "name": "Diya Iyer",
    "email": "diya.iyer414@gmail.com",
    "phone": "+91 9083 35703",
    "location": "Lucknow",
    "customer_segment": "New",
    "segment": "New",
    "is_returning": false,
    "previous_orders": 1,
    "previous_abandonments": 0,
    "lifetime_orders": 5,
    "lifetime_value": 120000.0,
    "lifetime_cart_value": 158400.0,
    "average_order_value": 24000.0,
    "total_sessions": 3,
    "total_recovered_spent": 26400.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.1686,
    "cancellation_rate": 0.0678,
    "preferred_payment_method": "Debit Card",
    "preferred_channel": "EMAIL",
    "risk_score": 47.1,
    "recent_sessions": [
      {
        "checkout_id": "CHK-39995-201",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-39995-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Debit Card",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-39995-203",
        "device": "Mobile (Android)",
        "payment_method": "Debit Card",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_139995",
      "name": "Diya Iyer",
      "email": "diya.iyer414@gmail.com",
      "phone": "+91 9083 35703",
      "location": "Lucknow",
      "customer_segment": "New",
      "lifetime_orders": 1,
      "lifetime_value": 120000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 16.9,
      "preferred_payment_method": "Debit Card",
      "preferred_channel": "EMAIL"
    },
    "unified_revenue_risk": {
      "composite_score": 47.1,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 0.0,
      "return_risk": 42.1,
      "rto_risk": 13.6,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 55.0
    },
    "next_best_action": {
      "recommended_action": "SIZING_CONSULTATION",
      "priority": "HIGH",
      "channel": "EMAIL",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High sizing return tendency; activate automated fit consultation."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-9995-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-9995-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Debit Card",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-39995-201",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-39995-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Debit Card",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-39995-203",
          "device": "Mobile (Android)",
          "payment_method": "Debit Card",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-9995-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_107989",
    "name": "Diya Chawla",
    "email": "diya.chawla545@gmail.com",
    "phone": "+91 9443 81932",
    "location": "Jaipur",
    "customer_segment": "New",
    "segment": "New",
    "is_returning": false,
    "previous_orders": 1,
    "previous_abandonments": 0,
    "lifetime_orders": 5,
    "lifetime_value": 120000.0,
    "lifetime_cart_value": 158400.0,
    "average_order_value": 24000.0,
    "total_sessions": 3,
    "total_recovered_spent": 26400.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.1277,
    "cancellation_rate": 0.0317,
    "preferred_payment_method": "Net Banking",
    "preferred_channel": "EMAIL",
    "risk_score": 37.3,
    "recent_sessions": [
      {
        "checkout_id": "CHK-07989-201",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-07989-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Net Banking",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-07989-203",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_107989",
      "name": "Diya Chawla",
      "email": "diya.chawla545@gmail.com",
      "phone": "+91 9443 81932",
      "location": "Jaipur",
      "customer_segment": "New",
      "lifetime_orders": 1,
      "lifetime_value": 120000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 12.8,
      "preferred_payment_method": "Net Banking",
      "preferred_channel": "EMAIL"
    },
    "unified_revenue_risk": {
      "composite_score": 37.3,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 0.0,
      "return_risk": 31.9,
      "rto_risk": 6.3,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "EMAIL",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-7989-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-7989-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-07989-201",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-07989-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Net Banking",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-07989-203",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-7989-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_106511",
    "name": "Neha Nair",
    "email": "neha.nair473@gmail.com",
    "phone": "+91 9527 28111",
    "location": "Kolkata",
    "customer_segment": "New",
    "segment": "New",
    "is_returning": false,
    "previous_orders": 1,
    "previous_abandonments": 0,
    "lifetime_orders": 5,
    "lifetime_value": 120000.0,
    "lifetime_cart_value": 158400.0,
    "average_order_value": 24000.0,
    "total_sessions": 3,
    "total_recovered_spent": 26400.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.0759,
    "cancellation_rate": 0.0131,
    "preferred_payment_method": "Net Banking",
    "preferred_channel": "SMS",
    "risk_score": 27.7,
    "recent_sessions": [
      {
        "checkout_id": "CHK-06511-201",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-06511-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Net Banking",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-06511-203",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_106511",
      "name": "Neha Nair",
      "email": "neha.nair473@gmail.com",
      "phone": "+91 9527 28111",
      "location": "Kolkata",
      "customer_segment": "New",
      "lifetime_orders": 1,
      "lifetime_value": 120000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 7.6,
      "preferred_payment_method": "Net Banking",
      "preferred_channel": "SMS"
    },
    "unified_revenue_risk": {
      "composite_score": 27.7,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 0.0,
      "return_risk": 19.0,
      "rto_risk": 2.6,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "SMS",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-6511-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-6511-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-06511-201",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-06511-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Net Banking",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-06511-203",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_137511",
    "name": "Ishaan Joshi",
    "email": "ishaan.joshi576@gmail.com",
    "phone": "+91 8265 34345",
    "location": "Chandigarh",
    "customer_segment": "New",
    "segment": "New",
    "is_returning": false,
    "previous_orders": 1,
    "previous_abandonments": 0,
    "lifetime_orders": 5,
    "lifetime_value": 120000.0,
    "lifetime_cart_value": 158400.0,
    "average_order_value": 24000.0,
    "total_sessions": 3,
    "total_recovered_spent": 26400.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.1147,
    "cancellation_rate": 0.0061,
    "preferred_payment_method": "Net Banking",
    "preferred_channel": "SMS",
    "risk_score": 32.8,
    "recent_sessions": [
      {
        "checkout_id": "CHK-37511-201",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-37511-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Net Banking",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-37511-203",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_137511",
      "name": "Ishaan Joshi",
      "email": "ishaan.joshi576@gmail.com",
      "phone": "+91 8265 34345",
      "location": "Chandigarh",
      "customer_segment": "New",
      "lifetime_orders": 1,
      "lifetime_value": 120000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 11.5,
      "preferred_payment_method": "Net Banking",
      "preferred_channel": "SMS"
    },
    "unified_revenue_risk": {
      "composite_score": 32.8,
      "risk_tier": "HEALTHY",
      "abandonment_risk": 0.0,
      "return_risk": 28.7,
      "rto_risk": 1.2,
      "fraud_risk": 15.0,
      "sentiment_friction_risk": 20.0
    },
    "next_best_action": {
      "recommended_action": "FREE_SHIPPING",
      "priority": "HIGH",
      "channel": "SMS",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "Waive delivery fee to unlock high-ticket cart conversion with maximum net profit."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-7511-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-7511-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-37511-201",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-37511-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Net Banking",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-37511-203",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-7511-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  },
  {
    "customer_id": "CUST_112785",
    "name": "Meera Das",
    "email": "meera.das163@gmail.com",
    "phone": "+91 9310 27004",
    "location": "Ahmedabad",
    "customer_segment": "New",
    "segment": "New",
    "is_returning": false,
    "previous_orders": 1,
    "previous_abandonments": 0,
    "lifetime_orders": 5,
    "lifetime_value": 120000.0,
    "lifetime_cart_value": 158400.0,
    "average_order_value": 24000.0,
    "total_sessions": 3,
    "total_recovered_spent": 26400.0,
    "total_abandonments_recorded": 0,
    "return_rate": 0.2539,
    "cancellation_rate": 0.0061,
    "preferred_payment_method": "Net Banking",
    "preferred_channel": "SMS",
    "risk_score": 53.7,
    "recent_sessions": [
      {
        "checkout_id": "CHK-12785-201",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 27600.0,
        "shipping_cost": 99.0,
        "started_at": "2026-03-05T18:42:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-12785-202",
        "device": "Desktop (Chrome)",
        "payment_method": "Net Banking",
        "cart_value": 22800.0,
        "shipping_cost": 0.0,
        "started_at": "2026-03-02T14:10:00Z",
        "status": "COMPLETED",
        "reason": null
      },
      {
        "checkout_id": "CHK-12785-203",
        "device": "Mobile (Android)",
        "payment_method": "Net Banking",
        "cart_value": 25200.0,
        "shipping_cost": 0.0,
        "started_at": "2026-02-26T11:22:00Z",
        "status": "COMPLETED",
        "reason": null
      }
    ],
    "profile": {
      "customer_id": "CUST_112785",
      "name": "Meera Das",
      "email": "meera.das163@gmail.com",
      "phone": "+91 9310 27004",
      "location": "Ahmedabad",
      "customer_segment": "New",
      "lifetime_orders": 1,
      "lifetime_value": 120000.0,
      "average_order_value": 24000.0,
      "return_rate_pct": 25.4,
      "preferred_payment_method": "Net Banking",
      "preferred_channel": "SMS"
    },
    "unified_revenue_risk": {
      "composite_score": 53.7,
      "risk_tier": "ELEVATED",
      "abandonment_risk": 0.0,
      "return_risk": 63.5,
      "rto_risk": 1.2,
      "fraud_risk": 65.0,
      "sentiment_friction_risk": 55.0
    },
    "next_best_action": {
      "recommended_action": "SIZING_CONSULTATION",
      "priority": "HIGH",
      "channel": "SMS",
      "expected_revenue": 28800.0,
      "expected_profit": 9216.0,
      "economic_rationale": "High sizing return tendency; activate automated fit consultation."
    },
    "history": {
      "orders": [
        {
          "order_id": "ORD-2785-891",
          "product_name": "Apparel & Lifestyle Essentials",
          "category": "Apparel",
          "order_value": 24000.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-02-18T12:00:00Z"
        },
        {
          "order_id": "ORD-2785-892",
          "product_name": "Ergonomic Desk & Sound Accessories",
          "category": "Accessories",
          "order_value": 20400.0,
          "payment_method": "Net Banking",
          "status": "DELIVERED",
          "created_at": "2026-01-24T15:30:00Z"
        }
      ],
      "checkouts": [
        {
          "checkout_id": "CHK-12785-201",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 27600.0,
          "shipping_cost": 99.0,
          "started_at": "2026-03-05T18:42:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-12785-202",
          "device": "Desktop (Chrome)",
          "payment_method": "Net Banking",
          "cart_value": 22800.0,
          "shipping_cost": 0.0,
          "started_at": "2026-03-02T14:10:00Z",
          "status": "COMPLETED",
          "reason": null
        },
        {
          "checkout_id": "CHK-12785-203",
          "device": "Mobile (Android)",
          "payment_method": "Net Banking",
          "cart_value": 25200.0,
          "shipping_cost": 0.0,
          "started_at": "2026-02-26T11:22:00Z",
          "status": "COMPLETED",
          "reason": null
        }
      ],
      "returns": [
        {
          "return_id": "RET-2785-01",
          "product_name": "Embroidered Cotton Kurta",
          "reason": "Size Sizing Fit Issue",
          "status": "REFUNDED",
          "refund_amount": 9600.0,
          "created_at": "2026-02-20T11:00:00Z"
        }
      ],
      "reviews": [
        {
          "review_text": "Great checkout experience and lightning fast delivery via Bluedart!",
          "rating": 5,
          "sentiment": "POSITIVE",
          "sentiment_score": 0.85,
          "language": "Hinglish",
          "created_at": "2026-02-25T16:40:00Z"
        }
      ]
    }
  }
];

export const customer360Map = customersList.reduce((acc, cust) => {
  acc[cust.customer_id] = cust;
  return acc;
}, {});

export function getCustomer360Data(customerId) {
  if (!customerId) return customersList[0];
  const normalizedId = customerId.toUpperCase();
  return (
    customer360Map[customerId] ||
    customer360Map[normalizedId] ||
    customersList.find(c => c.customer_id.toLowerCase() === customerId.toLowerCase()) ||
    customersList[0]
  );
}
