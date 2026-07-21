import { Injectable } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCareerDto: CreateCareerDto) {
    return await this.prisma.career.create({ data: createCareerDto });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.career.findMany({ skip, take: limit }),
      this.prisma.career.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findAllActive(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const currentDate = new Date();
    const where = {
      postDate: { lte: currentDate },
      endDate: { gte: currentDate },
    };

    const [data, total] = await Promise.all([
      this.prisma.career.findMany({ where, skip, take: limit }),
      this.prisma.career.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string) {
    const career = await this.prisma.career.findUnique({ where: { id } });

    if (!career) {
      throw new Error(`Creer with ${id} not Found!`);
    }

    return career;
  }

  async update(id: string, updateCareerDto: UpdateCareerDto) {
    const career = await this.prisma.career.findUnique({ where: { id } });

    if (!career) {
      throw new Error(`Career with ${id} not Found!`);
    }

    return this.prisma.career.update({ where: { id }, data: updateCareerDto });
  }

  async remove(id: string) {
    const career = await this.prisma.career.findUnique({ where: { id } });

    if (!career) {
      throw new Error(`Career with ${id} not Found!`);
    }

    return this.prisma.career.delete({ where: { id } });
  }
}
