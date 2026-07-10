import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = (
      process.env.DIRECT_URL ?? process.env.DATABASE_URL
    )?.trim();

    if (!connectionString) {
      throw new Error('DATABASE_URL or DIRECT_URL must be set');
    }

    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks() {
    await this.$disconnect();
  }
}
