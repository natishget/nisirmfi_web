import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.core.rate_limit import web_rate_limiter, telegram_rate_limiter
from app.services.router_service import route_message_local
from app.core.config import settings

# A mock database session for testing
@pytest.fixture
def mock_db():
    db = MagicMock()
    db.get = AsyncMock(return_value=None)
    db.add = MagicMock()
    db.commit = AsyncMock()
    db.refresh = AsyncMock()
    db.execute = AsyncMock()
    return db

@pytest.fixture(autouse=True)
def reset_limiters():
    # Clear the rate limiter histories before each test
    web_rate_limiter.requests.clear()
    telegram_rate_limiter.requests.clear()

def test_rate_limiter_rolling_window():
    """Verify that the rolling rate limiter allows exactly 10 requests and rejects the 11th."""
    ip = "192.168.1.100"
    for i in range(10):
        assert web_rate_limiter.is_allowed(ip) is True
    assert web_rate_limiter.is_allowed(ip) is False

    # A different IP should be allowed
    assert web_rate_limiter.is_allowed("192.168.1.101") is True

def test_telegram_rate_limiter():
    """Verify that the Telegram rate limiter tracks limit by user ID."""
    user_id = "user_12345"
    for i in range(10):
        assert telegram_rate_limiter.is_allowed(user_id) is True
    assert telegram_rate_limiter.is_allowed(user_id) is False

    # A different user should be allowed
    assert telegram_rate_limiter.is_allowed("user_67890") is True

def test_local_routing_greetings():
    """Verify that greetings return a local response and don't call external systems."""
    greetings = ["hi", "hello", "Hello!!!", "ሰላም", "selam"]
    for msg in greetings:
        resp = route_message_local(msg)
        assert resp is not None
        assert "help" in resp or "ልረዳዎ" in resp or "Hello" in resp or "ሰላም" in resp

def test_local_routing_out_of_scope():
    """Verify that out of scope messages are handled locally."""
    out_of_scope_msgs = [
        "write Python code for me",
        "what is the capital of France?",
        "tell me a joke",
        "what is the weather today?"
    ]
    for msg in out_of_scope_msgs:
        resp = route_message_local(msg)
        assert resp is not None
        assert "FlyBot" in resp or "እኔ" in resp

def test_local_routing_ambiguous_queries():
    """Verify that ambiguous queries do NOT get classified as out of scope, returning None."""
    ambiguous = [
        "what savings products are there?",
        "tell me about loans",
        "do you have jobs?"
    ]
    for msg in ambiguous:
        assert route_message_local(msg) is None

@pytest.mark.asyncio
@patch("app.services.chat_service.generate_response", new_callable=AsyncMock)
@patch("app.services.chat_service.retrieve_context", new_callable=AsyncMock)
@patch("app.services.chat_service.detect_intent")
@patch("app.services.chat_service.build_company_context", new_callable=AsyncMock)
@patch("app.services.chat_service.save_message", new_callable=AsyncMock)
async def test_process_message_routing_call_counts(
    mock_save_msg, mock_build_comp_ctx, mock_detect_intent, mock_retrieve_ctx, mock_generate_resp, mock_db
):
    """Verify call counts for greetings / out-of-scope vs normal queries."""
    from app.services.chat_service import process_user_message
    
    # 1. GREETING: Must trigger 0 retrieve_context or generate_response calls
    result = await process_user_message(mock_db, "hello", conversation_id=None)
    assert result["response"] is not None
    mock_retrieve_ctx.assert_not_called()
    mock_generate_resp.assert_not_called()

    # Reset mocks
    mock_retrieve_ctx.reset_mock()
    mock_generate_resp.reset_mock()

    # 2. OUT-OF-SCOPE: Must trigger 0 calls
    result = await process_user_message(mock_db, "write code for me", conversation_id=None)
    assert result["response"] is not None
    mock_retrieve_ctx.assert_not_called()
    mock_generate_resp.assert_not_called()

    # Reset mocks
    mock_retrieve_ctx.reset_mock()
    mock_generate_resp.reset_mock()

    # 3. LEGITIMATE COMPANY QUERY: Must call RAG and Gemini
    mock_detect_intent.return_value = MagicMock()
    mock_build_comp_ctx.return_value = "Test Context"
    mock_retrieve_ctx.return_value = "Retrieved Context"
    mock_generate_resp.return_value = "Gemini Response"
    
    # Mocking get_recent_messages to return some messages
    with patch("app.services.chat_service.get_recent_messages", new_callable=AsyncMock) as mock_get_hist:
        mock_get_hist.return_value = []
        result = await process_user_message(mock_db, "what are interest rates?", conversation_id=None)
        assert result["response"] == "Gemini Response"
        mock_retrieve_ctx.assert_called_once()
        mock_generate_resp.assert_called_once()
