import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  void request;

  const response = NextResponse.json({ message: "Logged out" });

  clearAuthCookie(response);

  return response;
}
