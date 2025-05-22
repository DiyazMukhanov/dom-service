import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  fullName: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsInt()
  @IsOptional()
  occupationId?: number;
}
