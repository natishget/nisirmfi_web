import "server-only";

import { Prisma } from "@prisma/client";

import prisma from "@/repositories/prismaClient";
import { AppError } from "@/utils/api/error";
import type { CareerCreateInput, CareerUpdateInput } from "@/validators/career";

const careerSelect = {
  id: true,
  title: true,
  department: true,
  location: true,
  type: true,
  purpose: true,
  responsibilities: true,
  qualification: true,
  salary: true,
  benefits: true,
  postDate: true,
  endDate: true,
} satisfies Prisma.CareerSelect;

export type CareerPayload = Prisma.CareerGetPayload<{
  select: typeof careerSelect;
}>;

type ListCareersOptions = {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  department?: string;
  activeOnly?: boolean;
};

type GetCareerOptions = {
  activeOnly?: boolean;
};

function buildCareerWhere({
  search,
  location,
  department,
  activeOnly = false,
}: Pick<
  ListCareersOptions,
  "search" | "location" | "department" | "activeOnly"
>) {
  const now = new Date();

  return {
    ...(activeOnly
      ? {
          postDate: { lte: now },
          endDate: { gte: now },
        }
      : {}),
    ...(location
      ? { location: { contains: location, mode: "insensitive" as const } }
      : {}),
    ...(department
      ? { department: { contains: department, mode: "insensitive" as const } }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { purpose: { contains: search, mode: "insensitive" as const } },
            { department: { contains: search, mode: "insensitive" as const } },
            { location: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  } satisfies Prisma.CareerWhereInput;
}

export async function listCareers(options: ListCareersOptions) {
  const where = buildCareerWhere(options);

  const [items, total] = await prisma.$transaction([
    prisma.career.findMany({
      where,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      orderBy: { postDate: "desc" },
      select: careerSelect,
    }),
    prisma.career.count({ where }),
  ]);

  return { items, total };
}

export async function getCareerById(
  id: string,
  options: GetCareerOptions = {},
) {
  const career = await prisma.career.findFirst({
    where: {
      id,
      ...(options.activeOnly
        ? {
            postDate: { lte: new Date() },
            endDate: { gte: new Date() },
          }
        : {}),
    },
    select: careerSelect,
  });

  if (!career) {
    throw new AppError("Career posting not found", 404, "NOT_FOUND");
  }

  return career;
}

export async function createCareer(data: CareerCreateInput) {
  return prisma.career.create({
    data,
    select: careerSelect,
  });
}

export async function updateCareer(id: string, data: CareerUpdateInput) {
  const payload: Prisma.CareerUpdateInput = {
    ...(data.title ? { title: data.title } : {}),
    ...(data.department ? { department: data.department } : {}),
    ...(data.location ? { location: data.location } : {}),
    ...(data.type ? { type: data.type } : {}),
    ...(data.purpose ? { purpose: data.purpose } : {}),
    ...(data.responsibilities
      ? { responsibilities: data.responsibilities }
      : {}),
    ...(data.qualification ? { qualification: data.qualification } : {}),
    ...(data.salary ? { salary: data.salary } : {}),
    ...(data.benefits ? { benefits: data.benefits } : {}),
    ...(data.postDate ? { postDate: data.postDate } : {}),
    ...(data.endDate ? { endDate: data.endDate } : {}),
  };

  return prisma.career.update({
    where: { id },
    data: payload,
    select: careerSelect,
  });
}

export async function deleteCareer(id: string) {
  await prisma.career.delete({ where: { id } });
}
