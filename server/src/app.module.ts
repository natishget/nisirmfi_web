import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { NewsModule } from './news/news.module';
import { CareerModule } from './career/career.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, NewsModule, CareerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
