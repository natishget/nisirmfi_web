import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { requireAdminAccess } from "@/lib/auth/admin";
import {
  deleteNews,
  getNewsById,
  updateNews,
} from "@/lib/services/news.service";
import { newsUpdateSchema } from "@/lib/validators/news";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const news = await getNewsById(id);

    return NextResponse.json({ data: news });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    requireAdminAccess(request);
    const { id } = await context.params;
    const body = newsUpdateSchema.parse(await request.json());
    const news = await updateNews(id, body);

    return NextResponse.json({ data: news });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    requireAdminAccess(request);
    const { id } = await context.params;
    await deleteNews(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
