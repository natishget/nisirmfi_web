import { AccountStatus } from 'src/generated/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOpenAccountDto {
  @IsEnum(AccountStatus)
  @IsNotEmpty()
  status!: AccountStatus;

  @IsString()
  @IsOptional()
  statusNotes?: string;
}
