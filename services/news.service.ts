import "server-only";

import { Prisma, NewsStatus } from "@prisma/client";

import prisma from "@/repositories/prismaClient";
import { AppError } from "@/utils/api/error";
import type { NewsCreateInput, NewsUpdateInput } from "@/validators/news";

const newsSelect = {
  id: true,
  title: true,
  category: true,
  status: true,
  summary: true,
  publishedDate: true,
  readTime: true,
  imageUrl: true,
  isFeatured: true,
} satisfies Prisma.NewsSelect;

export type NewsPayload = Prisma.NewsGetPayload<{ select: typeof newsSelect }>;

export async function listNews({
  page,
  limit,
  search,
  status,
  category,
  featured,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: NewsStatus;
  category?: string;
  featured?: boolean;
}) {
  const where: Prisma.NewsWhereInput = {
    ...(status ? { status } : {}),
    ...(category
      ? { category: { equals: category, mode: "insensitive" } }
      : {}),
    ...(typeof featured === "boolean" ? { isFeatured: featured } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { summary: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.news.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { publishedDate: "desc" },
      select: newsSelect,
    }),
    prisma.news.count({ where }),
  ]);

  return { items, total };
}

export async function getNewsById(id: string) {
  const news = await prisma.news.findUnique({
    where: { id },
    select: newsSelect,
  });

  if (!news) {
    throw new AppError("News item not found", 404, "NOT_FOUND");
  }

  return news;
}

export async function createNews(data: NewsCreateInput) {
  return prisma.news.create({
    data: {
      ...data,
      publishedDate: data.publishedDate,
    },
    select: newsSelect,
  });
}

export async function updateNews(id: string, data: NewsUpdateInput) {
  const payload: Prisma.NewsUpdateInput = {
    ...(data.title ? { title: data.title } : {}),
    ...(data.category ? { category: data.category } : {}),
    ...(data.status ? { status: data.status } : {}),
    ...(data.summary ? { summary: data.summary } : {}),
    ...(data.publishedDate ? { publishedDate: data.publishedDate } : {}),
    ...(typeof data.readTime === "number" ? { readTime: data.readTime } : {}),
    ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
    ...(typeof data.isFeatured === "boolean"
      ? { isFeatured: data.isFeatured }
      : {}),
  };

  return prisma.news.update({
    where: { id },
    data: payload,
    select: newsSelect,
  });
}

export async function deleteNews(id: string) {
  await prisma.news.delete({ where: { id } });
}
