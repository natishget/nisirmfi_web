from enum import Enum


class Intent(str, Enum):
    CAREER = "career"
    NEWS = "news"
    GENERAL = "general"


def detect_intent(
    message: str
) -> Intent:

    message = message.lower()

    career_keywords = [
        "job",
        "jobs",
        "career",
        "careers",
        "position",
        "vacancy",
        "vacancies",
        "hiring",
        "recruitment"
    ]

    news_keywords = [
        "news",
        "announcement",
        "latest",
        "update",
        "updates"
    ]

    if any(
        word in message
        for word in career_keywords
    ):
        return Intent.CAREER

    if any(
        word in message
        for word in news_keywords
    ):
        return Intent.NEWS

    return Intent.GENERAL