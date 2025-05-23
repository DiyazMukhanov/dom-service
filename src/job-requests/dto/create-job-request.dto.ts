import { IsString, IsDateString, IsOptional, IsInt } from 'class-validator';

export class CreateJobRequestDto {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsDateString()
  workDate: string;

  @IsString()
  workTime: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsInt()
  occupationId: number;

  @IsInt()
  categoryId: number;

  @IsInt()
  cityId: number;
}
