from sqlalchemy import select, func

from app.models.career import Career

async def get_active_careers(db):
    stmt = select(Career).where(
        Career.endDate > func.now()
    ).order_by(Career.postDate.desc())

    result = await db.execute(stmt)

    careers = result.scalars().all()

    return careers