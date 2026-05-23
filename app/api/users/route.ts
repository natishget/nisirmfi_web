import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { buildPaginationMeta, parsePagination } from "@/lib/api/pagination";
import { requireAdminAccess } from "@/lib/auth/admin";
import { createUser, listUsers } from "@/lib/services/user.service";
import { userCreateSchema } from "@/lib/validators/user";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request);

    const { page, limit } = parsePagination(request.nextUrl);
    const search = request.nextUrl.searchParams.get("search") ?? undefined;
    const result = await listUsers({ page, limit, search });

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

    const body = userCreateSchema.parse(await request.json());
    const user = await createUser(body);

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
