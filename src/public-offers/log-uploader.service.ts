import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class LogUploaderService {
  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly logger = new Logger(LogUploaderService.name);

  constructor(private readonly configService: ConfigService) {
    const keyFilename = this.configService.get<string>('GCP_KEY_FILE');
    const bucketName = this.configService.get<string>('GCS_BUCKET');

    if (!keyFilename || !bucketName) {
      throw new Error(
        'GCP_KEY_FILE or GCS_BUCKET is not defined in environment variables',
      );
    }

    this.bucketName = bucketName;
    this.storage = new Storage({ keyFilename });

    this.logger.log('✅ LogUploaderService initialized. GCS ready.');
  }

  async uploadOfferAcceptanceLog({
    jobRequestId,
    email,
    phoneNumber,
    offerVersion,
    offerContent,
    offerHash,
    clientIp,
    address,
    apartment,
  }: {
    jobRequestId: number;
    email: string;
    phoneNumber: string;
    offerVersion: string;
    offerContent: string;
    offerHash: string;
    clientIp: string;
    address: string;
    apartment: string;
  }): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `logs/job-requests/request-${jobRequestId}--${timestamp}.json`;

    const logData = {
      jobRequestId,
      email,
      phoneNumber,
      offerVersion,
      offerHash,
      offerContent,
      clientIp,
      timestamp,
      address,
      apartment,
      accepted: true,
    };

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(filename);

    await file.save(JSON.stringify(logData, null, 2), {
      resumable: false,
      contentType: 'application/json',
    });

    this.logger.log(`Log uploaded to GCS: ${filename}`);
    return filename; // путь, который можно сохранить в БД
  }
}
