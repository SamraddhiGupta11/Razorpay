from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from backend.app.ml.service import ml_service
from backend.app.schemas.prediction import (
    PredictAbandonmentRequest,
    PredictRecoveryRequest,
    RecommendActionRequest,
    FullRecoveryIntelligenceResponse
)

router = APIRouter(tags=["ML & Decision Intelligence"])

@router.post("/predict/abandonment")
def predict_abandonment(req: PredictAbandonmentRequest):
    """Predicts probability of checkout abandonment using Model 1."""
    try:
        data = req.model_dump()
        result = ml_service.predict_abandonment(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@router.post("/predict/recovery")
def predict_recovery(req: PredictRecoveryRequest):
    """Predicts likelihood of recovery using Model 2 on abandoned cart."""
    try:
        data = req.model_dump()
        result = ml_service.predict_recovery(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@router.post("/predict/reason")
def predict_reason(req: PredictAbandonmentRequest):
    """Diagnoses root cause with quantifiable evidence signals and metrics."""
    try:
        data = req.model_dump()
        result = ml_service.diagnose_reason(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reason diagnostic error: {str(e)}")

@router.post("/recommend-action", response_model=FullRecoveryIntelligenceResponse)
def recommend_recovery_action(req: RecommendActionRequest):
    """
    Executes full pipeline:
    DETECT -> DIAGNOSE -> PREDICT -> EXPLAIN (XAI) -> DECIDE (Next Best Action)
    """
    try:
        data = req.model_dump()
        result = ml_service.full_recovery_intelligence(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decision engine error: {str(e)}")

@router.get("/models/metrics")
def get_model_metrics():
    """Returns model benchmark performance metrics, ROC-AUC comparisons, and synthetic disclosure."""
    if ml_service.metrics:
        return ml_service.metrics
    return {
        "status": "pending_training",
        "message": "Metrics will be populated upon running python ml/training/train_all.py"
    }
