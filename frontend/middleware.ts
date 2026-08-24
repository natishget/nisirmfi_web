import { NextRequest, NextResponse } from "next/server";

const protectedPagePrefixes = [
  "/management",
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value ?? null;

  if (isProtectedPage(pathname) && !token) {
    const loginUrl = new URL("/admin-l09in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/management/:path*",
    "/news-management/:path*",
    "/career-management/:path*",
    "/careers-management/:path*",
    "/user-management/:path*",
    "/users-management/:path*",
    "/applications-management/:path*",
    "/users/:path*",
  ],
};
