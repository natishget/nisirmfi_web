from google import genai
from google.genai.types import GenerateContentConfig

from app.core.config import settings
from app.llm.system_prompt import SYSTEM_PROMPT

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


async def generate_response(
   history,
   prompt
):
    print("Generating response with history:")
    # for msg in history:
    #     print(f" - {msg.role}: {msg.content}")
    # print(f"Company context: {company_context}")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=history,
        config=GenerateContentConfig(
        system_instruction=prompt
    )
    )

    return response.text