import { NextRequest, NextResponse } from "next/server";

import { getJwtExpirationSeconds, verifyAuthToken } from "@/lib/jwt";

export const AUTH_COOKIE_NAME =
  process.env.AUTH_COOKIE_NAME ?? "nisir_auth_token";

export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

export type AuthSession = {
  userId: string;
  email: string;
  fullName: string;
};

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: getJwtExpirationSeconds(),
  };
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });
}

export function readAuthToken(request: NextRequest) {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getAuthSession(request: NextRequest) {
  const token = readAuthToken(request);

  if (!token) {
    throw new AuthError();
  }

  try {
    return await verifyAuthToken(token);
  } catch {
    throw new AuthError();
  }
}
