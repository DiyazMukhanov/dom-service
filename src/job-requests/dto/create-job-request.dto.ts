// src/job-requests/dto/create-job-request.dto.ts

import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateJobRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Тип работы обязателен' })
  workType: string;

  @IsString()
  @IsNotEmpty({ message: 'Описание работы обязательно' })
  workDescription: string;

  @IsString()
  @IsNotEmpty({ message: 'Дата работы обязательна' })
  workDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Время работы обязательно' })
  workTime: string;

  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Номер телефона обязателен' })
  phoneNumber: string;
}
