import { IsString } from 'class-validator';

export class CreateOccupationDto {
  @IsString()
  title: string;
}
