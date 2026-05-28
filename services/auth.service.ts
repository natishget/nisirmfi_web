import "server-only";

import prisma from "@/repositories/prismaClient";
import { AppError } from "@/utils/api/error";
import { comparePassword } from "@/utils/security/password";
import { signAuthToken } from "@/utils/jwt";
import type { AuthLoginInput, AuthRegisterInput } from "@/validators/auth";
import { createUser } from "@/services/user.service";

const safeUserSelect = {
  id: true,
  email: true,
  fullName: true,
} as const;

export async function registerAuthUser(data: AuthRegisterInput) {
  return createUser(data);
}

export async function loginAuthUser(data: AuthLoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      ...safeUserSelect,
      password: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
  }

  const passwordMatches = await comparePassword(data.password, user.password);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401, "UNAUTHORIZED");
  }

  const token = await signAuthToken({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    token,
  };
}
