import { IsNumber, IsInt } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  value: number;

  @IsInt()
  workerId: number;
}
