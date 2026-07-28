import logging

from google import genai
from google.genai.types import GenerateContentConfig

from app.core.config import settings
from app.llm.system_prompt import SYSTEM_PROMPT

logger = logging.getLogger(__name__)

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


async def generate_response(
   history,
   prompt
):
    logger.debug("Generating Gemini response")
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=history,
            config=GenerateContentConfig(
                system_instruction=prompt
            )
        )

        if not response.text:
            logger.warning("Gemini returned an empty response")
            return (
                "I'm sorry, I wasn't able to generate a response. "
                "Please try rephrasing your question."
            )

        return response.text

    except Exception as e:
        logger.error(f"Gemini API error: {e}", exc_info=True)
        return (
            "I'm sorry, I encountered an issue while generating a response. "
            "Please try again shortly."
        )