import io
import csv
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from psycopg2.extras import Json
from typing import Dict, Any, List
from backend.app.database import get_db
from backend.app.ml.service import ml_service

router = APIRouter(prefix="/reviews", tags=["Voice of Customer Intelligence"])

@router.get("/insights")
def get_review_insights(db: Session = Depends(get_db)):
    """Summary of customer voice: sentiment breakdown, aspect radar, topic clouds."""
    # Sentiment Counts
    sql_sent = text("SELECT sentiment, COUNT(*) as count FROM review_analysis GROUP BY sentiment;")
    sentiments = {r.sentiment: int(r.count) for r in db.execute(sql_sent).fetchall()}

    # Aspect Radar & Sentiment Breakdown
    sql_aspects = text("""
        SELECT 
            aspect,
            COUNT(*) as total_mentions,
            SUM(CASE WHEN sentiment = 'POSITIVE' THEN 1 ELSE 0 END) as pos_count,
            SUM(CASE WHEN sentiment = 'NEGATIVE' THEN 1 ELSE 0 END) as neg_count,
            ROUND(AVG(confidence), 2) as avg_confidence
        FROM review_aspects
        GROUP BY aspect
        ORDER BY total_mentions DESC;
    """)
    aspects = [
        {
            "aspect": r.aspect,
            "total_mentions": int(r.total_mentions),
            "positive_count": int(r.pos_count),
            "negative_count": int(r.neg_count),
            "net_sentiment_pct": round(((int(r.pos_count) - int(r.neg_count)) / max(int(r.total_mentions), 1)) * 100.0, 1),
            "confidence": float(r.avg_confidence)
        }
        for r in db.execute(sql_aspects).fetchall()
    ]

    # Language breakdown
    sql_lang = text("SELECT language_detected, COUNT(*) as count FROM review_analysis GROUP BY language_detected;")
    languages = {r.language_detected: int(r.count) for r in db.execute(sql_lang).fetchall()}

    # Recent Customer Suggestions
    sql_sug = text("""
        SELECT cs.aspect, cs.suggestion_text, cs.business_impact, cs.priority, c.name as customer_name
        FROM customer_suggestions cs
        JOIN customers c ON cs.customer_id = c.customer_id
        ORDER BY cs.created_at DESC
        LIMIT 10;
    """)
    suggestions = [
        {
            "aspect": r.aspect,
            "suggestion": r.suggestion_text,
            "business_impact": r.business_impact,
            "priority": r.priority,
            "customer_name": r.customer_name
        }
        for r in db.execute(sql_sug).fetchall()
    ]

    return {
        "success": True,
        "sentiment_distribution": sentiments,
        "aspect_radar": aspects,
        "languages": languages,
        "actionable_suggestions": suggestions
    }

@router.get("/recommendations")
def get_seller_recommendations(db: Session = Depends(get_db)):
    """Returns prioritized seller & merchant recommendations ranked by business impact."""
    sql = text("""
        SELECT 
            recommendation_id,
            issue,
            category,
            frequency_pct,
            sentiment_score,
            business_impact,
            estimated_monthly_impact,
            recommendation_text,
            priority,
            status
        FROM seller_recommendations
        ORDER BY estimated_monthly_impact DESC;
    """)
    recs = [
        {
            "recommendation_id": r.recommendation_id,
            "issue": r.issue,
            "category": r.category,
            "frequency_pct": float(r.frequency_pct),
            "sentiment_score": float(r.sentiment_score),
            "business_impact": r.business_impact,
            "estimated_monthly_impact": float(r.estimated_monthly_impact),
            "recommendation_text": r.recommendation_text,
            "priority": r.priority,
            "status": r.status
        }
        for r in db.execute(sql).fetchall()
    ]
    return recs

@router.get("/list")
def get_reviews_list(
    limit: int = Query(20, ge=1, le=100),
    sentiment: str = Query(None),
    aspect: str = Query(None),
    db: Session = Depends(get_db)
):
    """Feed of customer reviews with NLP aspect annotations."""
    clauses = []
    params = {"limit": limit}
    if sentiment:
        clauses.append("ra.sentiment = :sent")
        params["sent"] = sentiment.upper()

    where_clause = f"WHERE {' AND '.join(clauses)}" if clauses else ""

    sql = text(f"""
        SELECT 
            r.review_id,
            r.customer_id,
            c.name as customer_name,
            p.product_name,
            p.category,
            r.review_text,
            r.rating,
            ra.sentiment,
            ra.sentiment_score,
            ra.language_detected,
            r.created_at
        FROM reviews r
        JOIN review_analysis ra ON r.review_id = ra.review_id
        JOIN customers c ON r.customer_id = c.customer_id
        JOIN products p ON r.product_id = p.product_id
        {where_clause}
        ORDER BY r.created_at DESC
        LIMIT :limit;
    """)
    rows = db.execute(sql, params).fetchall()

    reviews = [
        {
            "review_id": r.review_id,
            "customer_id": r.customer_id,
            "customer_name": r.customer_name,
            "product_name": r.product_name,
            "category": r.category,
            "review_text": r.review_text,
            "rating": int(r.rating),
            "sentiment": r.sentiment,
            "sentiment_score": float(r.sentiment_score),
            "language": r.language_detected,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in rows
    ]
    return reviews

@router.post("/analyze")
def analyze_single_review(payload: Dict[str, Any]):
    """Processes a single review through the Voice of Customer NLP pipeline."""
    text_content = payload.get("review_text", "")
    rating = int(payload.get("rating", 5))
    if not text_content:
        raise HTTPException(status_code=400, detail="review_text is required.")
    
    return ml_service.process_review(text_content, rating)

@router.post("/bulk-analyze")
async def bulk_analyze_reviews(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Accepts CSV upload with columns: [review_id, customer_id, product_id, review_text, rating],
    runs multilingual NLP, extracts sentiment & aspects, and saves to database.
    """
    if not file.filename.endswith(('.csv', '.txt')):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    content = await file.read()
    decoded = content.decode('utf-8', errors='ignore')
    reader = csv.DictReader(io.StringIO(decoded))

    processed_count = 0
    results = []

    # Get sample customer & product for fallbacks
    sample_cid = db.execute(text("SELECT customer_id FROM customers LIMIT 1;")).fetchone()[0]
    sample_pid = db.execute(text("SELECT product_id FROM products LIMIT 1;")).fetchone()[0]

    for row in reader:
        if processed_count >= 100:  # Cap single batch for responsiveness
            break

        rtext = row.get("review_text") or row.get("text") or ""
        if not rtext.strip():
            continue

        rating = int(row.get("rating", 4))
        rid = row.get("review_id") or f"REV_BULK_{uuid.uuid4().hex[:8]}"
        cid = row.get("customer_id") or sample_cid
        pid = row.get("product_id") or sample_pid

        # Run NLP
        nlp_res = ml_service.process_review(rtext, rating)

        # Store in DB
        now = datetime.utcnow()
        db.execute(
            text("INSERT INTO reviews VALUES (:rid, :cid, :pid, NULL, :txt, :rating, :lang, :created) ON CONFLICT (review_id) DO NOTHING;"),
            {"rid": rid, "cid": cid, "pid": pid, "txt": rtext, "rating": rating, "lang": nlp_res["language_detected"], "created": now}
        )

        an_id = f"AN_{uuid.uuid4().hex[:10]}"
        db.execute(
            text("INSERT INTO review_analysis VALUES (:an_id, :rid, :sent, :score, :conf, :topics, :lang, :created) ON CONFLICT (analysis_id) DO NOTHING;"),
            {"an_id": an_id, "rid": rid, "sent": nlp_res["sentiment"], "score": nlp_res["sentiment_score"], "conf": nlp_res["confidence"], "topics": Json(nlp_res["topics"]), "lang": nlp_res["language_detected"], "created": now}
        )

        for asp in nlp_res["aspects"]:
            asp_id = f"ASP_{uuid.uuid4().hex[:10]}"
            db.execute(
                text("INSERT INTO review_aspects VALUES (:asp_id, :rid, :asp, :sent, :conf, :evid, :created) ON CONFLICT (aspect_id) DO NOTHING;"),
                {"asp_id": asp_id, "rid": rid, "asp": asp["aspect"], "sent": asp["sentiment"], "conf": asp["confidence"], "evid": asp["evidence"], "created": now}
            )

        processed_count += 1
        results.append({
            "review_id": rid,
            "text": rtext,
            "rating": rating,
            "language": nlp_res["language_detected"],
            "sentiment": nlp_res["sentiment"],
            "sentiment_score": nlp_res["sentiment_score"],
            "aspects": nlp_res["aspects"],
            "topics": nlp_res["topics"],
            "suggestions": nlp_res["suggestions"]
        })

    db.commit()

    return {
        "success": True,
        "processed_records": processed_count,
        "insights_sample": results[:10]
    }
