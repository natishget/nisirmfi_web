import "server-only";

import { Prisma } from "@prisma/client";

import prisma from "@/repositories/prismaClient";
import { AppError } from "@/utils/api/error";
import { hashPassword } from "@/utils/security/password";
import type { UserCreateInput, UserUpdateInput } from "@/validators/user";

const userSelect = {
  id: true,
  email: true,
  fullName: true,
} satisfies Prisma.UserSelect;

export type UserPayload = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export async function listUsers({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) {
  const where: Prisma.UserWhereInput | undefined = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { fullName: { contains: search, mode: "insensitive" } },
        ],
      }
    : undefined;

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { email: "asc" },
      select: userSelect,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  return user;
}

export async function createUser(data: UserCreateInput) {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      fullName: data.fullName,
      password: await hashPassword(data.password),
    },
    select: userSelect,
  });

  return user;
}

export async function updateUser(id: string, data: UserUpdateInput) {
  const payload: Prisma.UserUpdateInput = {
    ...(data.email ? { email: data.email } : {}),
    ...(data.fullName ? { fullName: data.fullName } : {}),
    ...(data.password ? { password: await hashPassword(data.password) } : {}),
  };

  const user = await prisma.user.update({
    where: { id },
    data: payload,
    select: userSelect,
  });

  return user;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
}
