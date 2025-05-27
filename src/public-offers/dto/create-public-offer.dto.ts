import { IsString } from 'class-validator';

export class CreatePublicOfferDto {
  @IsString()
  version: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
