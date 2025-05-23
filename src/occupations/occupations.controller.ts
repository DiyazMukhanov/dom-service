import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { OccupationsService } from './occupations.service';
import { CreateOccupationDto } from './dto/create-occupation.dto';
import { Occupation } from './entities/occupation.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('occupations')
export class OccupationsController {
  constructor(private readonly occupationsService: OccupationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Post()
  async create(
    @Body() createOccupationDto: CreateOccupationDto,
  ): Promise<Occupation> {
    return this.occupationsService.create(createOccupationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Get()
  async findAll(): Promise<Occupation[]> {
    return this.occupationsService.findAll();
  }
}
