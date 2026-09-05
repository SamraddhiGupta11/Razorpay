"""
REVIVEAI MODEL 1 TRAINING: ABANDONMENT PREDICTION
Trains and compares Random Forest vs Histogram Gradient Boosting.
Enforces strict zero data leakage.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from ml.preprocessing.features import engineer_features, assert_no_leakage

def train_abandonment_model(csv_path="data/checkout_records_100k.csv", model_dir="ml/models"):
    print("="*60)
    print("TRAINING MODEL 1: ABANDONMENT PREDICTION")
    print("="*60)

    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df):,} total records.")

    # Target
    y = df['abandoned'].astype(int)
    
    # Feature Engineering (strictly pre-abandonment features)
    print("Engineering session and customer behavioral features...")
    X = engineer_features(df)
    feature_names = list(X.columns)
    assert_no_leakage(feature_names)
    print(f"Feature matrix shape: {X.shape} ({len(feature_names)} features, zero leakage)")

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    print(f"Train samples: {len(X_train):,} | Test samples: {len(X_test):,}")

    # Model 1A: Histogram Gradient Boosting (Fast, high-performance GBDT)
    print("\nTraining HistGradientBoostingClassifier...")
    hgb = HistGradientBoostingClassifier(max_iter=150, learning_rate=0.08, max_leaf_nodes=31, random_state=42)
    hgb.fit(X_train, y_train)
    y_pred_hgb = hgb.predict(X_test)
    y_prob_hgb = hgb.predict_proba(X_test)[:, 1]

    # Model 1B: Random Forest
    print("Training RandomForestClassifier (100 estimators)...")
    rf = RandomForestClassifier(n_estimators=100, max_depth=14, n_jobs=-1, random_state=42)
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    y_prob_rf = rf.predict_proba(X_test)[:, 1]

    # Evaluation
    def eval_model(name, y_true, y_pred, y_prob):
        return {
            "model_name": name,
            "accuracy": round(accuracy_score(y_true, y_pred), 4),
            "precision": round(precision_score(y_true, y_pred), 4),
            "recall": round(recall_score(y_true, y_pred), 4),
            "f1_score": round(f1_score(y_true, y_pred), 4),
            "roc_auc": round(roc_auc_score(y_true, y_prob), 4),
            "confusion_matrix": confusion_matrix(y_true, y_pred).tolist()
        }

    metrics_hgb = eval_model("HistGradientBoosting", y_test, y_pred_hgb, y_prob_hgb)
    metrics_rf = eval_model("RandomForest", y_test, y_pred_rf, y_prob_rf)

    print("\nModel Evaluation Comparison:")
    print(f"{'Metric':<18} {'HistGradientBoosting':<22} {'RandomForest':<15}")
    print("-" * 55)
    for m in ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc']:
        print(f"{m:<18} {metrics_hgb[m]:<22} {metrics_rf[m]:<15}")

    # Pick best model based on ROC-AUC
    best_model, best_name, best_metrics = (hgb, "HistGradientBoosting", metrics_hgb) if metrics_hgb['roc_auc'] >= metrics_rf['roc_auc'] else (rf, "RandomForest", metrics_rf)
    print(f"\nSelected superior model: {best_name} (ROC-AUC: {best_metrics['roc_auc']})")

    # Save artifact
    os.makedirs(model_dir, exist_ok=True)
    artifact_path = os.path.join(model_dir, "abandonment_model.joblib")
    artifact_payload = {
        "model": best_model,
        "model_name": best_name,
        "feature_names": feature_names,
        "metrics": best_metrics,
        "comparison": {
            "HistGradientBoosting": metrics_hgb,
            "RandomForest": metrics_rf
        }
    }
    joblib.dump(artifact_payload, artifact_path)
    print(f"Model successfully saved to {artifact_path}")
    return artifact_payload

if __name__ == "__main__":
    train_abandonment_model()
