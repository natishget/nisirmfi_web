import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  Length,
} from 'class-validator';

export class CreateOpenAccountDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @Length(16, 16, { message: 'Fayda Number must be exactly 16 digits' })
  @Matches(/^\d+$/, { message: 'Fayda Number must contain only digits' })
  faydaNumber!: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth!: string;

  @IsString()
  @IsNotEmpty()
  birthPlace!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  kebele!: string;
}
