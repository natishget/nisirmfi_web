import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { requireAdminAccess } from "@/lib/auth/admin";
import { updateOpenAccount, deleteOpenAccount } from "@/services/openAccount.service";
import { openAccountUpdateSchema } from "@/validators/open-account";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminAccess(request);
    const { id } = await context.params;
    const rawBody = await request.json();
    const body = openAccountUpdateSchema.parse(rawBody);

    const updated = await updateOpenAccount(id, body);

    return NextResponse.json({ data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminAccess(request);
    const { id } = await context.params;
    
    await deleteOpenAccount(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
