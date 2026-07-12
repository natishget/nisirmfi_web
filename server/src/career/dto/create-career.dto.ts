import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  department!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  purpose!: string;

  @IsArray()
  @IsNotEmpty()
  responsibilities!: string[];

  @IsArray()
  @IsNotEmpty()
  qualification!: string[];

  @IsString()
  @IsNotEmpty()
  salary!: string;

  @IsArray()
  @IsNotEmpty()
  benefits!: string[];

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  postDate!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate!: Date;
}
