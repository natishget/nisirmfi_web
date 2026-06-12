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
  "/users",
];

function isProtectedPage(pathname: string) {
  return protectedPagePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = readAuthToken(request);
  const wantsJson = request.headers.get("accept")?.includes("application/json");

  if (!token) {
    if (isProtectedPage(pathname)) {
      return NextResponse.redirect(new URL("/admin-l09in", request.url));
    }

    return NextResponse.next();
  }

  try {
    await verifyAuthToken(token);

    return NextResponse.next();
  } catch {
    const response = isProtectedPage(pathname)
      ? NextResponse.redirect(new URL("/admin-l09in", request.url))
      : wantsJson
        ? NextResponse.json(
            { error: "Unauthorized", code: "UNAUTHORIZED" },
            { status: 401 },
          )
        : NextResponse.next();

    response.cookies.delete(AUTH_COOKIE_NAME);

    return response;
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
    "/users/:path*",
  ],
};
