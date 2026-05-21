import "server-only";

import { NextRequest } from "next/server";

import { AppError } from "@/lib/api/error";

export function requireAdminAccess(request: NextRequest) {
  const secret = process.env.ADMIN_API_KEY;

  if (!secret) {
    return;
  }

  const headerSecret =
    request.headers.get("x-admin-key") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (headerSecret !== secret) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }
}
