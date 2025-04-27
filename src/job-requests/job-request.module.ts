import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRequest } from './job-request.entity';
import { JobRequestService } from './job-request.service';
import { JobRequestController } from './job-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobRequest])],
  controllers: [JobRequestController],
  providers: [JobRequestService],
})
export class JobRequestModule {}
