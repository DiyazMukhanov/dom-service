import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRequest } from './entities/job-request.entity';
import { JobRequestService } from './job-request.service';
import { JobRequestController } from './job-request.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobRequest]), MailModule],
  controllers: [JobRequestController],
  providers: [JobRequestService],
})
export class JobRequestModule {}
