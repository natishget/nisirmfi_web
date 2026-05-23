import { NextRequest, NextResponse } from "next/server";

import { AuthError, getAuthSession } from "@/lib/auth";
import { handleApiError } from "@/lib/api/error";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession(request);

    return NextResponse.json({ data: session });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    return handleApiError(error);
  }
}
