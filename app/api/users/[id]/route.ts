import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { requireAdminAccess } from "@/lib/auth/admin";
import {
  deleteUser,
  getUserById,
  updateUser,
} from "@/lib/services/user.service";
import { userUpdateSchema } from "@/lib/validators/user";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    requireAdminAccess(_request);
    const { id } = await context.params;
    const user = await getUserById(id);

    return NextResponse.json({ data: user });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    requireAdminAccess(request);
    const { id } = await context.params;
    const body = userUpdateSchema.parse(await request.json());
    const user = await updateUser(id, body);

    return NextResponse.json({ data: user });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    requireAdminAccess(request);
    const { id } = await context.params;
    await deleteUser(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
