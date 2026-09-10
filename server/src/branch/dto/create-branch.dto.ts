import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  hours: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
