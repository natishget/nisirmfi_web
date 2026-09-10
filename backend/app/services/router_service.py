import re

# Simple language detection matching Ethiopic Unicode characters
_ETHIOPIC_PATTERN = re.compile(r'[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF]')

def is_amharic_local(text: str) -> bool:
    non_space = text.replace(" ", "")
    if not non_space:
        return False
    ethiopic_count = len(_ETHIOPIC_PATTERN.findall(non_space))
    return (ethiopic_count / len(non_space)) > 0.2

# Define exact patterns for greetings
GREETING_WORDS = {
    "hi", "hello", "hey", "selam", "ሰላም", "እንደምን", "tadias", "ታዲያስ",
    "welcome", "good morning", "good afternoon", "good evening", "good day",
    "hola", "greetings"
}

# Regex pattern for out of scope matching
OUT_OF_SCOPE_PATTERNS = [
    re.compile(r"\b(write|create|generate)\b.*\b(code|python|javascript|c\+\+|java|html|css|script|sql|function)\b", re.IGNORECASE),
    re.compile(r"\b(capital of|population of|weather in|temperature in)\b", re.IGNORECASE),
    re.compile(r"\b(tell me a joke|tell a joke|joke of the day)\b", re.IGNORECASE),
    re.compile(r"\b(who won|football match|soccer match|sports score|yesterday's game)\b", re.IGNORECASE),
    re.compile(r"\b(what is the weather|weather today|weather forecast)\b", re.IGNORECASE),
]

def route_message_local(message: str) -> str | None:
    """
    Checks if a message is a greeting or out of scope, returning a local response.
    Returns None if the query should proceed to RAG and LLM processing (COMPANY_QUERY).
    """
    clean_msg = message.strip()
    if not clean_msg:
        return "Please enter a valid message."
        
    # Lowercase clean msg with alphanumeric boundary
    normalized_msg = re.sub(r'[^\w\s\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF]', '', clean_msg).lower().strip()
    is_amharic = is_amharic_local(clean_msg)

    # 1. GREETING CHECK
    # Check if the whole normalized message matches any greeting word or starts with it followed by space
    is_greeting = False
    if normalized_msg in GREETING_WORDS:
        is_greeting = True
    else:
        for word in GREETING_WORDS:
            if normalized_msg.startswith(word + " ") or normalized_msg.endswith(" " + word):
                is_greeting = True
                break

    if is_greeting:
        if is_amharic:
            return "ሰላም! ዛሬ ስለ ንስር ማይክሮፋይናንስ በምን ልረዳዎ እችላለሁ?"
        return "Hello! How can I help you today with Nisir Microfinance?"

    # 2. OUT OF SCOPE CHECK
    for pattern in OUT_OF_SCOPE_PATTERNS:
        if pattern.search(clean_msg):
            if is_amharic:
                return "እኔ የንስር ማይክሮፋይናንስ ረዳት ፍላይቦት (FlyBot) ነኝ። እባክዎን ከንስር ማይክሮፋይናንስ አገልግሎቶች፣ ብድሮች፣ ቁጠባዎች፣ የስራ ማስታወቂያዎች ወይም ዜናዎች ጋር የተያያዙ ጥያቄዎችን ብቻ ይጠይቁ።"
            return "I am FlyBot, the official assistant for Nisir Microfinance. I can only assist you with information related to Nisir Microfinance products, services, loans, savings, careers, or news."

    # Return None for legitimate company queries
    return None
