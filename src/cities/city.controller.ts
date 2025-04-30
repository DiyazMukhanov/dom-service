import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  Delete,
  Param,
} from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Post()
  async createCity(@Body('name') name: string): Promise<City> {
    return this.cityService.createCity(name);
  }

  @Get()
  async findAllCities(): Promise<City[]> {
    return this.cityService.findAllCities();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Delete(':id')
  async removeCity(@Param('id') id: number): Promise<void> {
    return this.cityService.deleteCity(id);
  }
}
