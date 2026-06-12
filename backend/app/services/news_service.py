from sqlalchemy import select
from app.models.news import News, NewsStatus

async def get_active_news(db):
    # Pass NewsStatus.PUBLISHED directly or use NewsStatus.PUBLISHED.value
    stmt = select(News).where(
        News.status == NewsStatus.PUBLISHED
    ).order_by(News.publishedDate.desc())

    result = await db.execute(stmt)
    news = result.scalars().all()

    return news