import { Module } from '@nestjs/common';
import { OpenAccountService } from './open-account.service';
import { OpenAccountController } from './open-account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OpenAccountController],
  providers: [OpenAccountService],
})
export class OpenAccountModule {}
