import { IsString } from 'class-validator';

export class CreateJobRequestDto {
  @IsString()
  workType: string;

  @IsString()
  workDescription: string;

  @IsString()
  workDate: string;

  @IsString()
  workTime: string;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;
}
