import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Worker } from '../../worker/entities/worker.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Worker, (worker) => worker.ratings, { onDelete: 'CASCADE' })
  worker: Worker;
}
