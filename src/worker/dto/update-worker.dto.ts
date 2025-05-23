import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

export class UpdateWorkerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  occupationId?: number;
}
