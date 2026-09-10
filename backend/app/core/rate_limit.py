import time
from collections import defaultdict
import threading

class RollingRateLimiter:
    def __init__(self, limit: int, window_seconds: int = 86400):
        """
        limit: Maximum number of requests allowed per window
        window_seconds: Window duration in seconds (default: 24 hours / 86400s)
        """
        self.limit = limit
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
        self._lock = threading.Lock()

    def is_allowed(self, key: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds
        
        with self._lock:
            # Filter out timestamps older than the cutoff
            self.requests[key] = [t for t in self.requests[key] if t > cutoff]
            
            # Check if the limit has been reached
            if len(self.requests[key]) < self.limit:
                self.requests[key].append(now)
                return True
                
            return False

# Global instances for rolling rate limiting
# Allow 10 requests per rolling 24 hours for both web and telegram
web_rate_limiter = RollingRateLimiter(limit=10)
telegram_rate_limiter = RollingRateLimiter(limit=10)
