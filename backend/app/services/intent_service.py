from enum import Enum

class Intent(str, Enum):
    CAREER = "career"
    NEWS = "news"
    LOAN = "loan"
    SAVINGS = "savings"
    BRANCH = "branch"
    CONTACT = "contact"
    GENERAL = "general"


def detect_intent(message: str) -> Intent:
    message = message.lower()

    career_keywords = [
        "job", "jobs", "career", "careers", "position", "vacancy", "vacancies", 
        "hiring", "recruitment", "የስራ", "ስራ"
    ]

    news_keywords = [
        "news", "announcement", "latest", "update", "updates", "ዜና", "መረጃ"
    ]

    loan_keywords = [
        "loan", "loans", "borrow", "credit", "micro-loan", "financing", "ብድር", "መበደር"
    ]

    savings_keywords = [
        "saving", "savings", "deposit", "deposits", "account", "interest", "ቁጠባ", "ቆጣቢ"
    ]

    branch_keywords = [
        "branch", "branches", "location", "locations", "office", "offices", "ቅርንጫፍ", "ቅርንጫፎች"
    ]

    contact_keywords = [
        "contact", "phone", "email", "address", "call", "support", "ስልክ", "አድራሻ"
    ]

    if any(word in message for word in career_keywords):
        return Intent.CAREER

    if any(word in message for word in news_keywords):
        return Intent.NEWS

    if any(word in message for word in loan_keywords):
        return Intent.LOAN

    if any(word in message for word in savings_keywords):
        return Intent.SAVINGS

    if any(word in message for word in branch_keywords):
        return Intent.BRANCH

    if any(word in message for word in contact_keywords):
        return Intent.CONTACT

    return Intent.GENERAL