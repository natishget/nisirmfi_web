import "server-only";

export function parsePagination(url: URL) {
  const page = Math.max(Number(url.searchParams.get("page") ?? "1") || 1, 1);
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") ?? "10") || 10, 1),
    100,
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
) {
  return {
    total,
    page,
    limit,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  };
}
