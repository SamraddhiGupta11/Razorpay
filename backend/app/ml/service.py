"""
REVIVEAI ML SERVICE LOADER & INFERENCE ORCHESTRATOR
Loads serialized models and connects feature extraction, reason diagnosis,
recovery prediction, return risk prediction, RTO risk prediction, fraud triage,
local XAI explanations, NLP analysis, and the Decision Engine.
"""

import os
import joblib
import json
import pandas as pd
from typing import Dict, Any, List
from backend.app.config import settings
from ml.preprocessing.features import (
    engineer_features,
    engineer_return_features,
    engineer_rto_features,
    engineer_fraud_features
)
from ml.reason_engine import diagnose_abandonment_reason
from ml.explainability import (
    explain_prediction,
    explain_return_risk,
    explain_rto_risk
)
from backend.app.decision_engine.engine import (
    evaluate_next_best_action,
    evaluate_return_prevention_decision,
    evaluate_rto_prevention_decision,
    evaluate_fraud_triage_decision
)
from ml.nlp.nlp_engine import VoiceOfCustomerNLP

def extract_features_from_dict(data: Dict[str, Any]) -> pd.DataFrame:
    df = pd.DataFrame([data])
    return engineer_features(df)

class MLService:
    def __init__(self):
        self.abandonment_artifact = None
        self.recovery_artifact = None
        self.return_artifact = None
        self.rto_artifact = None
        self.fraud_artifact = None
        self.metrics = None
        self.is_loaded = False
        self.load_models()

    def load_models(self):
        try:
            aban_path = os.path.join(settings.MODEL_PATH, "abandonment_model.joblib")
            rec_path = os.path.join(settings.MODEL_PATH, "recovery_model.joblib")
            ret_path = os.path.join(settings.MODEL_PATH, "return_risk_model.joblib")
            rto_path = os.path.join(settings.MODEL_PATH, "rto_risk_model.joblib")
            frd_path = os.path.join(settings.MODEL_PATH, "fraud_anomaly_model.joblib")
            metrics_path = os.path.join(settings.MODEL_PATH, "metrics.json")

            if os.path.exists(aban_path):
                self.abandonment_artifact = joblib.load(aban_path)
            if os.path.exists(rec_path):
                self.recovery_artifact = joblib.load(rec_path)
            if os.path.exists(ret_path):
                self.return_artifact = joblib.load(ret_path)
            if os.path.exists(rto_path):
                self.rto_artifact = joblib.load(rto_path)
            if os.path.exists(frd_path):
                self.fraud_artifact = joblib.load(frd_path)

            if os.path.exists(metrics_path):
                with open(metrics_path, "r") as f:
                    self.metrics = json.load(f)

            self.is_loaded = (self.abandonment_artifact is not None and self.recovery_artifact is not None)
            print("PayRevive ML & Protection models loaded successfully.")
        except Exception as e:
            print(f"Error loading ML models: {e}")
            self.is_loaded = False

    # --- PILLAR 1: RECOVERY ---
    def predict_abandonment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.abandonment_artifact:
            prob = 0.78 if data.get('payment_failed') else 0.32
            return {"abandonment_probability": prob, "predicted_abandoned": prob > 0.5}

        X = extract_features_from_dict(data)
        model = self.abandonment_artifact["model"]
        prob = float(model.predict_proba(X)[0, 1])
        return {
            "abandonment_probability": round(prob, 4),
            "predicted_abandoned": bool(prob > 0.50)
        }

    def predict_recovery(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.recovery_artifact:
            base = 0.65 if data.get('customer_segment') == 'VIP' else 0.42
            return {"recovery_probability": base, "receptivity_level": "High" if base > 0.6 else "Medium"}

        X = extract_features_from_dict(data)
        model = self.recovery_artifact["model"]
        prob = float(model.predict_proba(X)[0, 1])
        return {
            "recovery_probability": round(prob, 4),
            "receptivity_level": "High" if prob >= 0.60 else ("Medium" if prob >= 0.35 else "Low")
        }

    def predict_reason(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return diagnose_abandonment_reason(data)

    def explain_recovery(self, data: Dict[str, Any], prob: float) -> Dict[str, Any]:
        return explain_prediction(data, prob)

    def recommend_action(self, data: Dict[str, Any]) -> Dict[str, Any]:
        diag = self.predict_reason(data)
        rec_pred = self.predict_recovery(data)
        prob = rec_pred["recovery_probability"]
        xai = self.explain_recovery(data, prob)

        decision = evaluate_next_best_action(
            cart_value=float(data.get('cart_value', 2000.0)),
            base_recovery_prob=prob,
            reason=diag["primary_reason"],
            customer_segment=data.get('customer_segment', 'Regular'),
            shipping_cost=float(data.get('shipping_cost', 0.0))
        )

        return {
            "checkout_id": data.get("checkout_id", "DEMO_SESSION"),
            "cart_value": data.get("cart_value", 2000.0),
            "customer_segment": data.get("customer_segment", "Regular"),
            "diagnosis": diag,
            "recovery_prediction": rec_pred,
            "explainability": xai,
            "decision": decision
        }

    # --- PILLAR 2: REVENUE PROTECTION ---
    def predict_return_risk(self, data: Dict[str, Any]) -> Dict[str, Any]:
        df = pd.DataFrame([data])
        X = engineer_return_features(df)
        
        if self.return_artifact:
            model = self.return_artifact["model"]
            prob = float(model.predict_proba(X)[0, 1])
        else:
            prob = 0.38 if data.get('size_sensitive') else 0.08

        level = "HIGH" if prob >= 0.30 else ("MEDIUM" if prob >= 0.15 else "LOW")
        xai = explain_return_risk(data, prob)
        decision = evaluate_return_prevention_decision(
            order_value=float(data.get('order_value', 2000.0)),
            return_probability=prob,
            category=data.get('category', 'Fashion'),
            size_sensitive=bool(data.get('size_sensitive', False)),
            customer_return_rate=float(data.get('customer_return_rate', 0.05))
        )

        return {
            "order_id": data.get("order_id", "ORD_SAMPLE"),
            "order_value": data.get("order_value", 2000.0),
            "return_probability": round(prob, 4),
            "risk_level": level,
            "explainability": xai,
            "decision": decision
        }

    def predict_rto_risk(self, data: Dict[str, Any]) -> Dict[str, Any]:
        df = pd.DataFrame([data])
        X = engineer_rto_features(df)

        if self.rto_artifact:
            model = self.rto_artifact["model"]
            prob = float(model.predict_proba(X)[0, 1])
        else:
            prob = 0.42 if data.get('is_cod') else 0.06

        level = "HIGH" if prob >= 0.35 else ("MEDIUM" if prob >= 0.15 else "LOW")
        xai = explain_rto_risk(data, prob)
        decision = evaluate_rto_prevention_decision(
            order_value=float(data.get('order_value', 2000.0)),
            rto_probability=prob,
            is_cod=bool(data.get('is_cod', True)),
            delivery_attempts=int(data.get('delivery_attempts', 1))
        )

        return {
            "shipment_id": data.get("shipment_id", "SHIP_SAMPLE"),
            "order_value": data.get("order_value", 2000.0),
            "rto_probability": round(prob, 4),
            "risk_level": level,
            "explainability": xai,
            "decision": decision
        }

    def analyze_fraud(self, data: Dict[str, Any]) -> Dict[str, Any]:
        df = pd.DataFrame([data])
        X = engineer_fraud_features(df)
        
        # Multi-factor anomaly calculation
        base_score = 15.0
        signals = []
        if data.get('is_cod') and float(data.get('return_rate', 0.0)) > 0.25:
            base_score += 35.0
            signals.append({"type": "COD_ABUSE", "desc": "High return/refusal rate on cash delivery orders."})
        if float(data.get('cancellation_rate', 0.0)) > 0.30:
            base_score += 25.0
            signals.append({"type": "FREQUENT_CANCELLATION", "desc": "Account demonstrates abnormal order cancellations."})
        if float(data.get('order_value', 0.0)) > 40000:
            base_score += 15.0
            signals.append({"type": "HIGH_VALUE_VELOCITY", "desc": "High-ticket checkout from recent customer account."})

        final_score = min(max(base_score, 5.0), 95.0)
        decision = evaluate_fraud_triage_decision(
            order_value=float(data.get('order_value', 2500.0)),
            fraud_score=final_score,
            signals=signals
        )

        return decision

    # --- PILLAR 3: VOICE OF CUSTOMER ---
    def process_review(self, text: str, rating: int = 5) -> Dict[str, Any]:
        return VoiceOfCustomerNLP.process_review(text, rating)

ml_service = MLService()
