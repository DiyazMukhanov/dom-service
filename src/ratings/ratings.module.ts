import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './entities/rating.entity';
import { Worker } from '../worker/entities/worker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Worker])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
