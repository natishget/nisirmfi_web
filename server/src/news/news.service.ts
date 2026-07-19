import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/client';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class NewsService {
  private static readonly newsIdPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(
    private readonly prisma: PrismaService,
    private readonly upload: UploadService,
  ) {}

  async create(file: Express.Multer.File, createNewsDto: CreateNewsDto) {
    try {
      console.log('we are on service');
      const uploaded = await this.upload.uploadToCloudinary(file);
      console.log('file upload response', uploaded);
      const news = await this.prisma.news.create({
        data: {
          ...createNewsDto,
          imageUrl: uploaded.secure_url,
          imagePublicId: uploaded.public_id,
          publishedDate: new Date(createNewsDto.publishedDate),
        },
      });
      return news;
    } catch (error: unknown) {
      console.log('error on news service', error);
      this.handlePrismaError(error, 'create news');
    }
  }

  async findAll(status?: string, limit?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    const take = limit ? parseInt(limit, 10) : undefined;
    return await this.prisma.news.findMany({
      where,
      take,
      orderBy: { publishedDate: 'desc' },
    });
  }

  async findOne(id: string) {
    this.assertValidNewsId(id);

    const news = await this.prisma.news.findUnique({ where: { id } });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    this.assertValidNewsId(id);

    try {
      return await this.prisma.news.update({
        where: { id },
        data: updateNewsDto,
      });
    } catch (error: unknown) {
      this.handlePrismaError(error, 'update news');
    }
  }

  async changeImage(id: string, file: Express.Multer.File) {
    try {
      const news = await this.prisma.news.findUnique({ where: { id } });
      if (!news) {
        throw new NotFoundException(`News with ID ${id} not found`);
      }

      // Delete the old image from Cloudinary
      if (news.imagePublicId) {
        await this.upload.deleteImage(news.imagePublicId);
      }

      // Upload the new image to Cloudinary
      const uploaded = await this.upload.uploadToCloudinary(file);

      // Update the news item with the new image URL and public ID
      return await this.prisma.news.update({
        where: { id },
        data: {
          imageUrl: uploaded.secure_url,
          imagePublicId: uploaded.public_id,
        },
      });
    } catch (error: unknown) {
      this.handlePrismaError(error, 'change news image');
    }
  }

  async remove(id: string) {
    this.assertValidNewsId(id);

    try {
      const news = await this.prisma.news.findUnique({ where: { id } });
      if (!news) {
        throw new NotFoundException(`News with ID ${id} not found`);
      }

      // Delete the image from Cloudinary
      if (news.imagePublicId) {
        await this.upload.deleteImage(news.imagePublicId);
      }
      return await this.prisma.news.delete({ where: { id } });
    } catch (error: unknown) {
      this.handlePrismaError(error, 'delete news');
    }
  }

  private assertValidNewsId(id: string) {
    if (!NewsService.newsIdPattern.test(id)) {
      throw new BadRequestException('News Not Found!');
    }
  }

  private handlePrismaError(error: unknown, action: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'A news item with the same unique field already exists',
        );
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('News Not Found!');
      }

      if (error.code === 'P2007') {
        throw new BadRequestException('News Not Found!');
      }
    }

    throw new InternalServerErrorException(`Failed to ${action}`);
  }
}
