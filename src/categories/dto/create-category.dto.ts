import { IsString, IsNumber, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsInt()
  occupationId: number;
}
