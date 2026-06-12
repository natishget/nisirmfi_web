from app.services.career_service import (
    get_active_careers
)

from app.services.news_service import (
    get_active_news
)

from app.services.intent_service import (
    Intent
)


async def build_company_context(db, intent: Intent):

    context = []

    if intent == Intent.CAREER:
        print("Intent is Career built:.............................................................................................................................................................................................................")
        careers = await get_active_careers(db)
        context.append("CAREERS:")

        for career in careers:

            context.append(
                f"- {career.title} ({career.location})"
            )
    elif intent == Intent.NEWS:
        print("Intent is News built:.............................................................................................................................................................................................................")
        news = await get_active_news(db)
        context.append("LATEST NEWS:")

        for item in news:
            context.append(
                f"- {item.title}"
            )


    return "\n".join(context)