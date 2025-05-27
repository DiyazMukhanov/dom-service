import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRequest } from './entities/job-request.entity';
import { JobRequestService } from './job-request.service';
import { JobRequestController } from './job-request.controller';
import { MailModule } from '../mail/mail.module';
import { Worker } from '../worker/entities/worker.entity';
import { SmsModule } from '../sms/sms.module';
import { PublicOffersModule } from '../public-offers/public-offers.module';
import { OfferAcceptanceLog } from '../public-offers/entities/offer-acceptance-log.entity';
import { LogUploaderService } from '../public-offers/log-uploader.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobRequest, Worker, OfferAcceptanceLog]),
    MailModule,
    SmsModule,
    PublicOffersModule,
  ],
  controllers: [JobRequestController],
  providers: [JobRequestService, LogUploaderService],
})
export class JobRequestModule {}
