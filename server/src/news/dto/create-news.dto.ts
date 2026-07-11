import { NewsStatus } from 'src/generated/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(NewsStatus)
  status!: NewsStatus;

  @IsString()
  @IsNotEmpty()
  summary!: string;

  @IsDateString()
  @IsNotEmpty()
  publishedDate!: string;

  @IsNumber()
  @IsNotEmpty()
  readTime!: number;

  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @IsBoolean()
  @IsNotEmpty()
  isFeatured!: boolean;
}
