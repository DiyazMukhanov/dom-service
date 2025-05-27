// src/offer-logs/offer-acceptance-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { JobRequest } from '../../job-requests/entities/job-request.entity';

@Entity()
export class OfferAcceptanceLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobRequest, (job) => job.id, { onDelete: 'CASCADE' })
  jobRequest: JobRequest;

  @Column()
  jobRequestId: number;

  @Column()
  offerVersion: string;

  @Column('text')
  offerContent: string;

  @Column()
  offerHash: string;

  @Column()
  clientIp: string;

  @Column({ nullable: true })
  clientEmail: string;

  @Column({ nullable: true })
  clientPhone: string;

  @CreateDateColumn()
  acceptedAt: Date;
}
