import "server-only";

import { Prisma, AccountStatus } from "@prisma/client";

import prisma from "@/repositories/prismaClient";
import { AppError } from "@/utils/api/error";
import type {
  OpenAccountCreateInput,
  OpenAccountUpdateInput,
} from "@/validators/open-account";

const openAccountSelect = {
  id: true,
  applicationId: true,
  firstName: true,
  lastName: true,
  phone: true,
  faydaNumber: true,
  dateOfBirth: true,
  birthPlace: true,
  city: true,
  kebele: true,
  status: true,
  statusNotes: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AccountSelect;

export type OpenAccountPayload = Prisma.AccountGetPayload<{
  select: typeof openAccountSelect;
}>;

type ListOpenAccountsOptions = {
  page: number;
  limit: number;
  search?: string;
  status?: AccountStatus;
};

function buildOpenAccountWhere({
  search,
  status,
}: Pick<ListOpenAccountsOptions, "search" | "status">) {
  return {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
            { faydaNumber: { contains: search, mode: "insensitive" as const } },
            { applicationId: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  } satisfies Prisma.AccountWhereInput;
}

export async function listOpenAccounts(options: ListOpenAccountsOptions) {
  const where = buildOpenAccountWhere(options);

  const [items, total] = await prisma.$transaction([
    prisma.account.findMany({
      where,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      orderBy: { createdAt: "desc" },
      select: openAccountSelect,
    }),
    prisma.account.count({ where }),
  ]);

  return { items, total };
}

export async function getOpenAccountById(id: string) {
  const openAccount = await prisma.account.findUnique({
    where: { id },
    select: openAccountSelect,
  });

  if (!openAccount) {
    throw new AppError("Application not found", 404, "NOT_FOUND");
  }

  return openAccount;
}

export async function getOpenAccountByApplicationId(applicationId: string) {
  // Return masked/limited data for tracking to prevent data leakage (XSS, enumeration, IDOR)
  const openAccount = await prisma.account.findUnique({
    where: { applicationId },
    select: {
      id: true,
      applicationId: true,
      firstName: true,
      lastName: true,
      status: true,
      statusNotes: true,
      createdAt: true,
    },
  });

  if (!openAccount) {
    throw new AppError("Application not found", 404, "NOT_FOUND");
  }

  return openAccount;
}

export async function createOpenAccount(
  data: OpenAccountCreateInput,
  applicationId: string,
) {
  return prisma.account.create({
    data: {
      ...data,
      applicationId,
      status: "PENDING",
    },
    select: openAccountSelect,
  });
}

export async function updateOpenAccount(
  id: string,
  data: OpenAccountUpdateInput,
) {
  return prisma.account.update({
    where: { id },
    data: {
      status: data.status,
      statusNotes: data.statusNotes,
    },
    select: openAccountSelect,
  });
}

export async function deleteOpenAccount(id: string) {
  await prisma.account.delete({ where: { id } });
}

export async function getAccountStats() {
  const counts = await prisma.account.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  const stats = {
    TOTAL: 0,
    PENDING: 0,
    UNDER_REVIEW: 0,
    APPROVED: 0,
    REJECTED: 0,
    MORE_INFO_REQUIRED: 0,
  };

  let total = 0;
  counts.forEach((item) => {
    if (item.status in stats) {
      stats[item.status] = item._count.status;
    }
    total += item._count.status;
  });
  stats.TOTAL = total;

  return stats;
}
