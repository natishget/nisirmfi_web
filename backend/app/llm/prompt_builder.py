from app.models.message import MessageRole
from app.llm.system_prompt import SYSTEM_PROMPT


def build_conversation_history(messages):

    history = []

    for message in messages:

        if message.role == MessageRole.USER:
            history.append({
                "role": "user",
                "parts": [{"text": message.content}]
            })

        elif message.role == MessageRole.ASSISTANT:
            history.append({
                "role": "model",
                "parts": [{"text": message.content}]
            })

    return history

def build_prompt(
    company_context: str,
    context: str,
    user_message: str
):
    return f"""
{SYSTEM_PROMPT}

company knowledge:
{context}

Company Information:
{company_context}

on the company information if you do not find any information related to branch, careers or news, then it means their is no new or career opening so say so.

Current User Question:
{user_message}

Instructions:
- Use company information when answering.
- Use conversation history for context.
- If information is unavailable, say so.
"""