import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error";
import { registerAuthUser } from "@/lib/services/auth.service";
import { authRegisterSchema } from "@/lib/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const body = authRegisterSchema.parse(await request.json());
    const user = await registerAuthUser(body);

    return NextResponse.json(
      {
        data: user,
        message: "Registration successful",
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
