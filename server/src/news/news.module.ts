import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { UploadService } from '../upload/upload.service';

@Module({
  // imports: [UploadService],
  controllers: [NewsController],
  providers: [NewsService, UploadService],
})
export class NewsModule {}
