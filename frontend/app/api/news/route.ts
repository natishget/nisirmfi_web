import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { buildPaginationMeta, parsePagination } from "@/lib/api/pagination";
import { requireAdminAccess } from "@/lib/auth/admin";
import { createNews, listNews } from "@/lib/services/news.service";
import { newsCreateSchema } from "@/lib/validators/news";
import { validateAndSaveImage } from "@/lib/api/upload";

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

    // Secure backend practice: public users can only query PUBLISHED news.
    // Authenticated admins are allowed to request other statuses or list all news.
    let queryStatus: "PUBLISHED" | "DRAFT" | "ARCHIVED" | undefined = "PUBLISHED";
    try {
      await requireAdminAccess(request);
      queryStatus = status ?? undefined;
    } catch {
      queryStatus = "PUBLISHED";
    }

    const result = await listNews({
      page,
      limit,
      search,
      status: queryStatus,
      category: category === "All" ? undefined : category,
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
    // Authenticate admin access first
    await requireAdminAccess(request);

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const statusVal = formData.get("status") as string;
    const summary = formData.get("summary") as string;
    const publishedAt = formData.get("publishedAt") as string;
    const readTimeRaw = formData.get("readTime") as string;
    const featured = formData.get("featured") === "true";

    const file = formData.get("image") as File | null;
    let dbImagePath = "/placeholder.svg"; // Fallback placeholder if nothing provided

    if (file && file.size > 0) {
      dbImagePath = await validateAndSaveImage(file);
    } else {
      const existingImageUrl = formData.get("existingImageUrl") as string | null;
      if (existingImageUrl) {
        dbImagePath = existingImageUrl;
      }
    }

    // Map status from frontend to backend DB enum
    const statusMapped =
      statusVal === "Published" ? "PUBLISHED" :
      statusVal === "Draft" ? "DRAFT" :
      statusVal === "Scheduled" ? "ARCHIVED" :
      (["PUBLISHED", "DRAFT", "ARCHIVED"].includes(statusVal) ? (statusVal as any) : "DRAFT");

    // Extract readTime number from string (e.g. "3 min read" -> 3)
    let readTimeVal = 3;
    if (readTimeRaw) {
      const match = readTimeRaw.match(/\d+/);
      if (match) {
        readTimeVal = parseInt(match[0], 10);
      }
    }

    const publishedDateVal = publishedAt ? new Date(publishedAt) : new Date();

    // Parse and validate using Zod
    const body = newsCreateSchema.parse({
      title,
      category,
      status: statusMapped,
      summary,
      publishedDate: publishedDateVal,
      readTime: readTimeVal,
      imageUrl: dbImagePath,
      isFeatured: featured,
    });

    const news = await createNews(body, dbImagePath);

    return NextResponse.json({ data: news }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
