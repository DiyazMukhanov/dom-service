import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { Occupation } from '../occupations/entities/occupation.entity';
import { Worker } from './entities/worker.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Worker, Occupation]), MailModule],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
