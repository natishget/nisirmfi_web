import "server-only";

import { NextRequest } from "next/server";

import { AppError } from "@/utils/api/error";
import { getAuthSession } from "@/services/auth";

export async function requireAdminAccess(request: NextRequest) {
  try {
    return await getAuthSession(request);
  } catch {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }
}
