import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { buildPaginationMeta, parsePagination } from "@/lib/api/pagination";
import { requireAdminAccess } from "@/lib/auth/admin";
import { createCareer, listCareers } from "@/lib/services/career.service";
import { careerCreateSchema } from "@/lib/validators/career";

export async function GET(request: NextRequest) {
  try {
    const { page, limit } = parsePagination(request.nextUrl);
    const search = request.nextUrl.searchParams.get("search") ?? undefined;
    const location = request.nextUrl.searchParams.get("location") ?? undefined;
    const department =
      request.nextUrl.searchParams.get("department") ?? undefined;

    const result = await listCareers({
      page,
      limit,
      search,
      location,
      department,
      activeOnly: true,
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
    const body = careerCreateSchema.parse(await request.json());
    const career = await createCareer(body);

    return NextResponse.json({ data: career }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
