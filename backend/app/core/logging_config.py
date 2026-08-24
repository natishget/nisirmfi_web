import logging
import sys


def setup_logging(level: int = logging.INFO):
    """
    Configure structured logging for the entire application.

    Sets a consistent format across all modules and routes output
    to stdout for container/cloud-friendly log collection.
    """
    root_logger = logging.getLogger()

    # Avoid adding duplicate handlers on repeated calls
    if root_logger.handlers:
        return

    root_logger.setLevel(level)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)

    formatter = logging.Formatter(
        fmt="[%(asctime)s] %(levelname)s %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)

    root_logger.addHandler(handler)

    # Suppress noisy third-party loggers
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("telegram").setLevel(logging.WARNING)
