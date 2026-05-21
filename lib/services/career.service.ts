import "server-only";

import { Prisma } from "@prisma/client";

import prisma from "@/lib/db/prisma";
import { AppError } from "@/lib/api/error";
import type {
  CareerCreateInput,
  CareerUpdateInput,
} from "@/lib/validators/career";

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

export async function listCareers({
  page,
  limit,
  search,
  location,
  department,
}: {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  department?: string;
}) {
  const where: Prisma.CareerWhereInput = {
    ...(location
      ? { location: { contains: location, mode: "insensitive" } }
      : {}),
    ...(department
      ? { department: { contains: department, mode: "insensitive" } }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { purpose: { contains: search, mode: "insensitive" } },
            { department: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.career.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { postDate: "desc" },
      select: careerSelect,
    }),
    prisma.career.count({ where }),
  ]);

  return { items, total };
}

export async function getCareerById(id: string) {
  const career = await prisma.career.findUnique({
    where: { id },
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
