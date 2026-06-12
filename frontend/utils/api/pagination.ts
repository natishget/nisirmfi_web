import { NextURL } from "next/dist/server/web/next-url";

export function parsePagination(url: NextURL | URL) {
  const params = (url as any).searchParams ?? new URL(String(url)).searchParams;

  const page = Number(params.get("page") ?? "1");
  const limit = Number(params.get("limit") ?? "10");

  return { page: Math.max(1, page), limit: Math.max(1, limit) };
}

export function buildPaginationMeta(
  totalOrOptions: number | { page: number; limit: number; total: number },
  pageArg?: number,
  limitArg?: number,
) {
  let page: number;
  let limit: number;
  let total: number;

  if (typeof totalOrOptions === "number") {
    total = totalOrOptions;
    page = pageArg ?? 1;
    limit = limitArg ?? 10;
  } else {
    ({ page, limit, total } = totalOrOptions);
  }

  const totalPages = Math.ceil(total / limit);

  return { page, limit, total, totalPages };
}
