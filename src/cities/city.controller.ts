import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCity(@Body('name') name: string, @Request() req): Promise<City> {
    const user = req.user;

    if (user.role !== 'manager') {
      throw new ForbiddenException('Только manager может добавлять города');
    }

    return this.cityService.createCity(name);
  }

  @Get()
  async findAllCities(): Promise<City[]> {
    return this.cityService.findAllCities();
  }
}
