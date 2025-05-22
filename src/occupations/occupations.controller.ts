import { Controller, Post, Body, UseGuards } from '@nestjs/common';
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

  // @Get()
  //   findAll() {
  //     return this.occupationsService.findAll();
  //   }
  //
  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.occupationsService.findOne(+id);
  //   }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOccupationDto: UpdateOccupationDto) {
  //   return this.occupationsService.update(+id, updateOccupationDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.occupationsService.remove(+id);
  // }
}
