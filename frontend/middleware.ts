import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, readAuthToken } from "@/lib/auth";
import { verifyAuthToken } from "@/lib/jwt";

const protectedPagePrefixes = [
  "/dashboard",
  "/news-management",
  "/career-management",
  "/careers-management",
  "/user-management",
  "/users-management",
  "/applications-management",
  "/users",
];

function isProtectedPage(pathname: string) {
  return protectedPagePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    await verifyAuthToken();

    return NextResponse.next();
  } catch (error) {
    return error instanceof Error;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/news-management/:path*",
    "/career-management/:path*",
    "/careers-management/:path*",
    "/user-management/:path*",
    "/users-management/:path*",
    "/applications-management/:path*",
    "/users/:path*",
  ],
};
