import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Occupation } from '../../occupations/entities/occupation.entity';
import { Category } from '../../categories/entities/category.entity';
import { Worker } from '../../worker/entities/worker.entity';
import { City } from '../../cities/entities/city.entity';

@Entity('job_requests')
export class JobRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'date', nullable: false })
  workDate: string;

  @Column()
  workTime: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  apartment: string;

  @Column({ nullable: true })
  comments: string;

  @Column({
    type: 'enum',
    enum: ['opened', 'booked', 'closed'],
    default: 'opened',
  })
  status: 'opened' | 'booked' | 'closed';

  @ManyToOne(() => Occupation, { eager: true, nullable: false })
  @JoinColumn({ name: 'occupation_id' })
  occupation: Occupation;

  @Column()
  occupation_id: number;

  @ManyToOne(() => Category, { eager: true, nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: number;

  @ManyToOne(() => Worker, { nullable: true })
  @JoinColumn({ name: 'booked_by' })
  bookedBy: Worker;

  @Column({ nullable: true })
  booked_by: number;

  @ManyToOne(() => City, { eager: true, nullable: false })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column()
  city_id: number;

  @Column({ default: false })
  offerAccepted: boolean;

  @Column()
  offerAcceptedAt: Date;

  @Column()
  acceptedOfferVersion: string;

  @Column('text')
  acceptedOfferContent: string;

  @Column()
  acceptedOfferHash: string;

  @Column({ nullable: true })
  clientIp: string;

  @CreateDateColumn()
  createdAt: Date;
}
