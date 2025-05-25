import { IsOptional, IsString } from 'class-validator';

export class UpdateOccupationDto {
  @IsOptional()
  @IsString()
  title?: string;
}
