import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { requireAdminAccess } from "@/lib/auth/admin";
import {
  deleteCareer,
  getCareerById,
  updateCareer,
} from "@/lib/services/career.service";
import { careerUpdateSchema } from "@/lib/validators/career";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const career = await getCareerById(id);

    return NextResponse.json({ data: career });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    requireAdminAccess(request);
    const { id } = await context.params;
    const body = careerUpdateSchema.parse(await request.json());
    const career = await updateCareer(id, body);

    return NextResponse.json({ data: career });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    requireAdminAccess(request);
    const { id } = await context.params;
    await deleteCareer(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
