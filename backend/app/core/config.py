from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_API_KEY: str
    TELEGRAM_BOT_TOKEN: str
    
    # Comma-separated list of trusted proxy IPs
    TRUSTED_PROXIES: str = ""
    
    # Bounded RAG context character budget
    RAG_CONTEXT_BUDGET_CHARS: int = 4000
    
    # Maximum conversation messages history limit
    HISTORY_MAX_MESSAGES: int = 10

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()