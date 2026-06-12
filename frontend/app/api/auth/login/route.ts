import { NextRequest, NextResponse } from "next/server";

import { setAuthCookie } from "@/lib/auth";
import { handleApiError } from "@/lib/api/error";
import { loginAuthUser } from "@/lib/services/auth.service";
import { authLoginSchema } from "@/lib/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const body = authLoginSchema.parse(await request.json());
    const { user, token } = await loginAuthUser(body);
    const response = NextResponse.json({
      data: user,
      message: "Login successful",
    });

    setAuthCookie(response, token);

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
