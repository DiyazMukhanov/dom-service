import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsInt()
  occupationId?: number;
}
