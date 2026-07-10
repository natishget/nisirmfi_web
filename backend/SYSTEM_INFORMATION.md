# System Architecture & Pipeline Documentation: FlyBot Backend

This backend system powers **FlyBot**, an intelligent, automated chat interface for **Nisir Microfinance**. It is built using **FastAPI** and orchestrates a secure, stateful asynchronous pipeline combining a custom relational database, an **AI-powered Retrieval-Augmented Generation (RAG)** vector index, and the **Google Gemini LLM**.

---

## 1. High-Level Architecture Overview

The system runs asynchronously using a multi-client entry design. It simultaneously surfaces web endpoints via standard HTTP and establishes a persistent background task to ingest chat interactions directly from external messaging applications.

* **Web Client Workflow:** Receives HTTP POST payloads from a stateless frontend UI.
* **Telegram Client Workflow:** Continuously monitors updates from Telegram using long-polling inside a background event loop task.
* **Core Execution Pipeline:** Both streams pass their normalized payloads directly into a unified service method (`process_user_message`), which coordinates database access, contextual search, history mapping, and LLM orchestration.

---

## 2. Dynamic Component Breakdown

### A. Dual-Client Entry Points
The application processes messages from two completely different interfaces, handling routing and identifier transformation uniquely for each:

1. **Web Client Router (`app/api/router/chat.py`)**
   * Exposes stateless public endpoints (e.g., `/chat/send`).
   * Captures the visitor's hardware footprint by checking incoming connection properties or extracting upstream proxy values from `x-forwarded-for` headers.
   * Forwards client IP context natively into the ingestion workflow.

2. **Telegram Client Router (`app/api/router/telegram.py`)**
   * Launched at runtime inside FastAPI’s global `lifespan` cycle using `asyncio.create_task()`.
   * Establishes an asynchronous long-polling connection utilizing the `python-telegram-bot` framework.
   * **Deterministic Identity Translation:** Telegram provides standard numeric chat handles (e.g., `'966618514'`). To prevent data mismatches with a strictly-typed database schema, the system converts this number into a permanent, 36-character structured string via a Version 5 namespace UUID calculation using a standard DNS namespace placeholder and the string-converted Telegram chat ID.
   * This guarantees that a specific user always resolves to the exact same database key across conversations, while keeping native numerical handles isolated for direct chat actions like displaying a `typing` indicator status.

### B. Core Execution Engine (`process_user_message`)
Every message converges into a single, unified pipeline located in `app/services/chat_service.py`. The system steps through the following technical sequence:

1. **Session Resolution:** It scans the database engine using an `AsyncSession` context manager block. If the conversation string matches an existing primary key inside the `conversations` table, it appends the transaction; if not, it automatically runs a factory script creating a permanent row.
2. **Context & Ingestion Processing:**
   * **Intent Detection:** Analyzes the raw text payload to isolate user intent using an explicit service script (`detect_intent`).
   * **Company Context Generation:** Queries business rules and specific institutional schemas (`build_company_context`) mapped to that isolated intent.
   * **Vector Space Retrieval (RAG):** Simultaneously converts the text into a deep vector array embedding (optimized at **3072 dimensions**). It runs a mathematical proximity query against text vectors stored in PostgreSQL to isolate context relevant to the user's prompt.
3. **Historical Assembly:** Pulls previous multi-turn messages from the conversation history table using a look-back layer (`get_recent_messages`).
4. **Prompt Harmonization:** Feeds the company policies, historical context, and immediate user prompt into a structured prompt assembly script.
5. **LLM Synthesis:** Dispatches the consolidated prompt wrapper along with conversational memory to the Gemini API (`generate_response`) to synthesize an accurate, context-aware reply.
6. **Persistence:** Saves the resulting assistant response back into the relational database before yielding final strings up to the client interface.

---

## 3. Database Schema Overview (SQLAlchemy)

The underlying database uses **PostgreSQL** coupled with an asynchronous driver (`asyncpg`) and **SQLAlchemy** ORM mapping.

* **`conversations` Table:** Manages the relational anchor points for a multi-turn dialogue. Contains unique primary keys (UUID parameters), creation/update timestamps, and relational handles for mapping chat endpoints.
* **`messages` Table:** Stores the individual text exchanges. 
  * Columns: `id`, `conversation_id` (foreign key pointing to conversations), `role` (mapped to an explicit Enum separating `USER` and `ASSISTANT`), `content` (text blob), `created_at` timestamp.

---

## 4. Key Execution Logs (System Output Proof)

When initialized successfully, the terminal lifecycle validates the framework connectivity cleanly:

```text
INFO:     Uvicorn running on [http://0.0.0.0:8000](http://0.0.0.0:8000) (Press CTRL+C to quit)
INFO:     Started reloader process using StatReload
INFO:     Waiting for application startup.
Embedding Dimension: 3072
Starting Telegram Bot long-polling service...
INFO:     Application startup complete.

=== RAG CONTEXT ===
[Extracted Context Blobs from PostgreSQL Vector Database]
====================================================

=== PROMPT ===
[System Instruction Framework + Injected Context + History + Query]
====================================================