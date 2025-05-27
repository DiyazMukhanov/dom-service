import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicOffersService } from './public-offers.service';
import { PublicOffersController } from './public-offers.controller';
import { PublicOffer } from './entities/public-offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicOffer])],
  controllers: [PublicOffersController],
  providers: [PublicOffersService],
  exports: [PublicOffersService],
})
export class PublicOffersModule {}
