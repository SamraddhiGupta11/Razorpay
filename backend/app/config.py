import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "PayRevive"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5433/payrevive")
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
    MODEL_PATH: str = os.getenv("MODEL_PATH", "ml/models/")
    API_PREFIX: str = "/api"
    GROSS_MARGIN: float = 0.35  # Standard 35% margin for e-commerce profit calculations

    class Config:
        case_sensitive = True

settings = Settings()
