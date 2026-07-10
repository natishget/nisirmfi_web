import datetime
from collections import defaultdict

class DailyRateLimiter:
    def __init__(self, limit: int):
        """
        limit: Maximum number of requests allowed per day
        """
        self.limit = limit
        self.requests = defaultdict(int)
        self.current_day = datetime.date.today()

    def is_allowed(self, key: str) -> bool:
        today = datetime.date.today()
        
        # Reset the counts if we are on a new day
        if today != self.current_day:
            self.requests.clear()
            self.current_day = today
        
        # Check if the limit has been reached
        if self.requests[key] < self.limit:
            self.requests[key] += 1
            return True
            
        return False

# Global instances for daily rate limiting
# Allow 15 requests per day for both web and telegram
web_rate_limiter = DailyRateLimiter(limit=15)
telegram_rate_limiter = DailyRateLimiter(limit=15)
