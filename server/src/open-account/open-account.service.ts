import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountStatus } from 'src/generated/client';
import { CreateOpenAccountDto } from './dto/create-open-account.dto';
import { UpdateOpenAccountDto } from './dto/update-open-account.dto';

@Injectable()
export class OpenAccountService {
  constructor(private readonly prisma: PrismaService) {}

  async generateApplicationId(): Promise<string> {
    let exists = true;
    let applicationId = '';
    while (exists) {
      applicationId = `NSR-${Math.floor(100000 + Math.random() * 900000)}`;
      const account = await this.prisma.account.findUnique({
        where: { applicationId },
      });
      if (!account) {
        exists = false;
      }
    }
    return applicationId;
  }

  async create(dto: CreateOpenAccountDto) {
    const applicationId = await this.generateApplicationId();
    return this.prisma.account.create({
      data: {
        ...dto,
        dateOfBirth: new Date(dto.dateOfBirth),
        applicationId,
        status: AccountStatus.PENDING,
      },
    });
  }

  async findAll(page = 1, limit = 10, search?: string, status?: AccountStatus) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { faydaNumber: { contains: search, mode: 'insensitive' } },
        { applicationId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.account.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.account.count({ where }),
    ]);

    return { items, total };
  }

  async findOne(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });
    if (!account) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return account;
  }

  async findByApplicationId(applicationId: string) {
    const account = await this.prisma.account.findUnique({
      where: { applicationId },
      select: {
        id: true,
        applicationId: true,
        firstName: true,
        lastName: true,
        status: true,
        statusNotes: true,
        createdAt: true,
      },
    });
    if (!account) {
      throw new NotFoundException(`Application with Reference ID ${applicationId} not found`);
    }
    return account;
  }

  async update(id: string, dto: UpdateOpenAccountDto) {
    await this.findOne(id);
    return this.prisma.account.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.account.delete({
      where: { id },
    });
  }

  async getStats() {
    const counts = await this.prisma.account.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const stats = {
      TOTAL: 0,
      PENDING: 0,
      UNDER_REVIEW: 0,
      APPROVED: 0,
      REJECTED: 0,
      MORE_INFO_REQUIRED: 0,
    };

    let total = 0;
    counts.forEach((item) => {
      if (item.status in stats) {
        stats[item.status] = item._count.status;
      }
      total += item._count.status;
    });
    stats.TOTAL = total;

    return stats;
  }
}
