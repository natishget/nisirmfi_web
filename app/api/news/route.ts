import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { buildPaginationMeta, parsePagination } from "@/lib/api/pagination";
import { requireAdminAccess } from "@/lib/auth/admin";
import { createNews, listNews } from "@/lib/services/news.service";
import { newsCreateSchema } from "@/lib/validators/news";

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = parsePagination(request.nextUrl);
    const search = request.nextUrl.searchParams.get("search") ?? undefined;
    const status = request.nextUrl.searchParams.get("status") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED"
      | null;
    const category = request.nextUrl.searchParams.get("category") ?? undefined;
    const featured = request.nextUrl.searchParams.get("featured");

    const result = await listNews({
      page,
      limit,
      search,
      status: status ?? undefined,
      category,
      featured: featured === null ? undefined : featured === "true",
    });

    return NextResponse.json({
      data: result.items,
      meta: buildPaginationMeta(result.total, page, limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAccess(request);
    const body = newsCreateSchema.parse(await request.json());
    const news = await createNews(body);

    return NextResponse.json({ data: news }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
