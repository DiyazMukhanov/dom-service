import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { JobRequestModule } from './job-requests/job-request.module';
import { CityModule } from './cities/city.module';
import { WorkerModule } from './worker/worker.module';
import { OccupationsModule } from './occupations/occupations.module';
import { RatingsModule } from './ratings/ratings.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    JobRequestModule,
    CityModule,
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    WorkerModule,
    OccupationsModule,
    RatingsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
