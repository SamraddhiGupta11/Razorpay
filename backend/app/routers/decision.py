from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from backend.app.ml.service import ml_service
from backend.app.decision_engine.engine import (
    evaluate_next_best_action,
    evaluate_return_prevention_decision,
    evaluate_rto_prevention_decision,
    evaluate_fraud_triage_decision
)

router = APIRouter(prefix="/decision", tags=["AI Decision Center"])

@router.post("/next-best-action")
def compute_next_best_action(payload: Dict[str, Any]):
    """
    Unified AI Decision Center endpoint:
    Evaluates candidate interventions across Recovery, Return Prevention, RTO, or Fraud,
    computing expected profit, direct action costs, net benefits, and ROI.
    """
    pillar = payload.get("pillar", "RECOVER").upper()

    if pillar in ["RECOVER", "ABANDONMENT"]:
        return ml_service.recommend_action(payload)

    elif pillar in ["RETURN", "PROTECT_RETURN"]:
        order_val = float(payload.get("order_value", 2500.0))
        ret_prob = float(payload.get("return_probability", 0.35))
        return evaluate_return_prevention_decision(
            order_value=order_val,
            return_probability=ret_prob,
            category=payload.get("category", "Fashion"),
            size_sensitive=bool(payload.get("size_sensitive", True)),
            customer_return_rate=float(payload.get("customer_return_rate", 0.05))
        )

    elif pillar in ["RTO", "PROTECT_RTO"]:
        order_val = float(payload.get("order_value", 2500.0))
        rto_prob = float(payload.get("rto_probability", 0.40))
        return evaluate_rto_prevention_decision(
            order_value=order_val,
            rto_probability=rto_prob,
            is_cod=bool(payload.get("is_cod", True)),
            delivery_attempts=int(payload.get("delivery_attempts", 1))
        )

    elif pillar in ["FRAUD", "PROTECT_FRAUD"]:
        order_val = float(payload.get("order_value", 5000.0))
        fraud_score = float(payload.get("fraud_score", 45.0))
        signals = payload.get("signals", [])
        return evaluate_fraud_triage_decision(
            order_value=order_val,
            fraud_score=fraud_score,
            signals=signals
        )

    else:
        raise HTTPException(status_code=400, detail=f"Unknown decision pillar: {pillar}")
