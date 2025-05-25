import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { OccupationsService } from './occupations.service';
import { CreateOccupationDto } from './dto/create-occupation.dto';
import { Occupation } from './entities/occupation.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateOccupationDto } from './dto/update-occupation.dto';

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
  @Roles('manager', 'admin')
  @Get()
  async findAll(): Promise<Occupation[]> {
    return this.occupationsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOccupationDto: UpdateOccupationDto,
  ): Promise<Occupation> {
    return this.occupationsService.update(id, updateOccupationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.occupationsService.remove(id);
  }
}
