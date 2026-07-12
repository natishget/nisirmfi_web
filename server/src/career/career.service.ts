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

  async findAll() {
    return await this.prisma.career.findMany();
  }

  async findAllActive() {
    const currentDate = new Date();
    return await this.prisma.career.findMany({
      where: {
        endDate: {
          gte: currentDate,
        },
      },
    });
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
