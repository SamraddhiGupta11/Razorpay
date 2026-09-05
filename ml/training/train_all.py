"""
REVIVEAI COMPLETE MODEL TRAINING PIPELINE
Runs Model 1 (Abandonment) & Model 2 (Recovery) training,
and aggregates comprehensive benchmark metrics to ml/models/metrics.json.
"""

import os
import json
from datetime import datetime
from ml.training.train_abandonment import train_abandonment_model
from ml.training.train_recovery import train_recovery_model

def train_all_models():
    print("Starting ReviveAI Complete ML Pipeline Training...")
    start_time = datetime.utcnow()

    res_aban = train_abandonment_model()
    res_rec = train_recovery_model()

    metrics_payload = {
        "timestamp": start_time.isoformat(),
        "dataset": "checkout_records_100k.csv (Synthetic)",
        "synthetic_disclosure": "Trained on calibrated synthetic telemetry modeled on e-commerce transaction dynamics with strict zero-leakage temporal separation.",
        "models": {
            "model_1_abandonment": {
                "selected_algorithm": res_aban["model_name"],
                "best_metrics": res_aban["metrics"],
                "comparison": res_aban["comparison"]
            },
            "model_2_recovery": {
                "selected_algorithm": res_rec["model_name"],
                "best_metrics": res_rec["metrics"],
                "comparison": res_rec["comparison"]
            }
        },
        "reason_engine": {
            "type": "Diagnostic Evidentiary Rule & Heuristic Engine",
            "categories": ["SHIPPING", "PAYMENT", "PRICE", "TECHNICAL", "HESITATION", "TRUST"],
            "evidence_signals": ["shipping_ratio", "payment_attempts", "payment_failed", "technical_errors", "coupon_views", "time_on_checkout_min"]
        },
        "explainability": {
            "type": "Local Feature Attribution Engine (PREDICT -> EXPLAIN -> DECIDE)",
            "supports": ["positive_drivers", "negative_drivers", "percentage_weights"]
        }
    }

    metrics_path = "ml/models/metrics.json"
    with open(metrics_path, "w") as f:
        json.dump(metrics_payload, f, indent=2)

    print(f"\nAll models trained and comprehensive metrics saved to {metrics_path}")

if __name__ == "__main__":
    train_all_models()
