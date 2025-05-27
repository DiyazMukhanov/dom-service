import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PublicOffersService } from './public-offers.service';
import { CreatePublicOfferDto } from './dto/create-public-offer.dto';
import { UpdatePublicOfferDto } from './dto/update-public-offer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('public-offers')
export class PublicOffersController {
  constructor(private readonly service: PublicOffersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Post()
  create(@Body() dto: CreatePublicOfferDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePublicOfferDto) {
    return this.service.update(+id, dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.setActive(+id);
  }

  @Get('/active')
  getActive() {
    return this.service.getActive();
  }
}
