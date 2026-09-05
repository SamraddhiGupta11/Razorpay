import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.routers import (
    health,
    dashboard,
    recovery,
    protection,
    returns,
    rto,
    fraud,
    reviews,
    decision,
    customers,
    predict,
    checkouts,
    interventions,
    simulator,
    models,
    demo,
    analytics
)

app = FastAPI(
    title="PayRevive API",
    description="PayRevive Closed-Loop Revenue Intelligence Platform: Recover Lost Revenue · Protect Future Revenue · Listen to Customers",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Health Check at both root and /api
app.include_router(health.router, prefix="")
app.include_router(health.router, prefix=settings.API_PREFIX)

# Mount Feature Routers under /api
app.include_router(dashboard.router, prefix=settings.API_PREFIX)
app.include_router(recovery.router, prefix=settings.API_PREFIX)
app.include_router(protection.router, prefix=settings.API_PREFIX)
app.include_router(returns.router, prefix=settings.API_PREFIX)
app.include_router(rto.router, prefix=settings.API_PREFIX)
app.include_router(fraud.router, prefix=settings.API_PREFIX)
app.include_router(reviews.router, prefix=settings.API_PREFIX)
app.include_router(decision.router, prefix=settings.API_PREFIX)
app.include_router(customers.router, prefix=settings.API_PREFIX)
app.include_router(predict.router, prefix=settings.API_PREFIX)
app.include_router(checkouts.router, prefix=settings.API_PREFIX)
app.include_router(interventions.router, prefix=settings.API_PREFIX)
app.include_router(simulator.router, prefix=settings.API_PREFIX)
app.include_router(models.router, prefix=settings.API_PREFIX)
app.include_router(demo.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "message": "Welcome to PayRevive Closed-Loop Revenue Intelligence API",
        "docs": "/docs",
        "health": "/health",
        "version": settings.VERSION,
        "pillars": {
            "recover": "Checkout Sessions, Abandonment Diagnosis, Next Best Action",
            "protect": "Return Risk, RTO Risk, Logistics Anomalies, Layered Fraud Detection",
            "listen": "Multilingual / Hinglish Aspect Sentiment, Customer Suggestions, Seller Recommendations"
        },
        "mode": "Jury-Ready Production Architecture"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
