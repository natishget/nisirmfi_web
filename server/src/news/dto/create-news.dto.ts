import { NewsStatus } from 'src/generated/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

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

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  readTime!: number;

  // @IsString()
  // @IsNotEmpty()
  // imageUrl!: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsNotEmpty()
  isFeatured!: boolean;
}
