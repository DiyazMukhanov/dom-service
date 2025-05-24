import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  IsEmail,
} from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  fullName: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsInt()
  occupationId?: number;

  @IsEmail()
  email: string;
}
