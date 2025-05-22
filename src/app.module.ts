import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { JobRequestModule } from './job-requests/job-request.module';
import { CityModule } from './cities/city.module';
import { MailModule } from './mail/mail.module';
import { WorkerModule } from './worker/worker.module';
import { OccupationsModule } from './occupations/occupations.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
