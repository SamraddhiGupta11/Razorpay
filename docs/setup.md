# ReviveAI Local Setup Guide

## System Requirements
- Python 3.11+ / 3.14
- Node.js v18+ / v20+
- PostgreSQL 15+ / 18

## 1. Database Initialization
```powershell
# In PowerShell:
powershell -ExecutionPolicy Bypass -File scripts/init_postgres.ps1
powershell -ExecutionPolicy Bypass -File scripts/start_postgres.ps1
```

## 2. Environment Variables
```bash
cp .env.example .env
```

## 3. Dataset Generation & Database Ingestion
```bash
python scripts/generate_data.py
python scripts/import_data.py
```

## 4. Machine Learning Model Training
```bash
python -m ml.training.train_all
```

## 5. Start Backend Server
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Swagger API Documentation: `http://127.0.0.1:8000/docs`

## 6. Start React Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open in browser: `http://127.0.0.1:5173`
