import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('job_requests')
export class JobRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workType: string;

  @Column()
  workDescription: string;

  @Column()
  workDate: string;

  @Column()
  workTime: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;
}
