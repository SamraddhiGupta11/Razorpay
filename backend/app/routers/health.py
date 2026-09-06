import os
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.ml.service import ml_service

router = APIRouter(tags=["Health"])

@router.get("/health", status_code=status.HTTP_200_OK)
def health_check(db: Session = Depends(get_db)):
    db_connected = False
    try:
        db.execute(text("SELECT 1;"))
        db_connected = True
    except Exception:
        db_connected = False

    models_loaded = bool(ml_service.is_loaded)
    is_healthy = db_connected and models_loaded

    db_name = "payrevive"
    try:
        if db.bind and db.bind.url and db.bind.url.database:
            db_name = db.bind.url.database
    except Exception:
        pass

    return {
        "status": "healthy" if is_healthy else "degraded",
        "database": "connected" if db_connected else "disconnected",
        "database_name": db_name,
        "models": "loaded" if models_loaded else "pending",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }
