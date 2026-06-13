import { NextRequest, NextResponse } from "next/server";

import { handleApiError, AppError } from "@/utils/api/error";
import { getOpenAccountByApplicationId } from "@/services/openAccount.service";

export async function GET(request: NextRequest) {
  try {
    const applicationId = request.nextUrl.searchParams.get("applicationId");
    if (!applicationId) {
      throw new AppError("Application Reference ID is required.", 400, "BAD_REQUEST");
    }

    const application = await getOpenAccountByApplicationId(applicationId.trim().toUpperCase());

    // Mask name for applicant safety (prevents data harvesting)
    const mask = (str: string) => {
      if (str.length <= 2) return str;
      return str[0] + "*".repeat(str.length - 2) + str[str.length - 1];
    };

    const maskedName = `${mask(application.firstName)} ${mask(application.lastName)}`;

    return NextResponse.json({
      data: {
        applicationId: application.applicationId,
        applicantName: maskedName,
        status: application.status,
        statusNotes: application.statusNotes,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
