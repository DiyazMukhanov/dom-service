import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Occupation } from '../../occupations/entities/occupation.entity';

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  fullName: string;

  @Column('float', { default: 0 })
  rating: number;

  @ManyToOne(() => Occupation, { eager: true, nullable: true })
  @JoinColumn({ name: 'occupation_id' })
  occupation: Occupation;
}
