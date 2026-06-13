import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { handleApiError, AppError } from "@/utils/api/error";
import { buildPaginationMeta, parsePagination } from "@/lib/api/pagination";
import { requireAdminAccess } from "@/lib/auth/admin";
import {
  createOpenAccount,
  listOpenAccounts,
  getAccountStats,
} from "@/services/openAccount.service";
import { openAccountCreateSchema } from "@/validators/open-account";
import prisma from "@/repositories/prismaClient";
import { AccountStatus } from "@prisma/client";

// Cryptographically generate a random, non-sequential Application ID
function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.randomBytes(6);
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `NISIR-${year}-${code}`;
}

// Check for collision and retry if necessary (highly secure)
async function generateUniqueApplicationId(): Promise<string> {
  let attempts = 0;
  while (attempts < 5) {
    const id = generateApplicationId();
    const existing = await prisma.account.findUnique({
      where: { applicationId: id },
    });
    if (!existing) {
      return id;
    }
    attempts++;
  }
  throw new AppError("Failed to generate a unique Application ID. Please try again.", 500, "GENERATION_FAILURE");
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const body = openAccountCreateSchema.parse(rawBody);

    // Duplicate submission check: check for active/pending application with the same Fayda Number
    const existing = await prisma.account.findFirst({
      where: {
        faydaNumber: body.faydaNumber,
        status: {
          in: ["PENDING", "UNDER_REVIEW", "MORE_INFO_REQUIRED"] as AccountStatus[],
        },
      },
    });

    if (existing) {
      throw new AppError(
        "An active application already exists for this Fayda Number.",
        400,
        "DUPLICATE_APPLICATION"
      );
    }

    const applicationId = await generateUniqueApplicationId();
    const newAccount = await createOpenAccount(body, applicationId);

    return NextResponse.json(
      {
        message: "Application submitted successfully.",
        data: {
          id: newAccount.id,
          applicationId: newAccount.applicationId,
          firstName: newAccount.firstName,
          lastName: newAccount.lastName,
          createdAt: newAccount.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin only access
    await requireAdminAccess(request);

    const { page, limit } = parsePagination(request.nextUrl);
    const search = request.nextUrl.searchParams.get("search") ?? undefined;
    
    let status: AccountStatus | undefined = undefined;
    const rawStatus = request.nextUrl.searchParams.get("status");
    if (rawStatus && ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "MORE_INFO_REQUIRED"].includes(rawStatus)) {
      status = rawStatus as AccountStatus;
    }

    const result = await listOpenAccounts({ page, limit, search, status });
    const stats = await getAccountStats();

    return NextResponse.json({
      data: result.items,
      meta: buildPaginationMeta(result.total, page, limit),
      stats,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
