import "server-only";

import { NextRequest } from "next/server";

import { AppError } from "@/lib/api/error";
import { getAuthSession } from "@/lib/auth";

export async function requireAdminAccess(request: NextRequest) {
  try {
    return await getAuthSession(request);
  } catch {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }
}
