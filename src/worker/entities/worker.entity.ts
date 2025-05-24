import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Occupation } from '../../occupations/entities/occupation.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column()
  fullName: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Rating, (rating) => rating.worker)
  ratings: Rating[];

  @ManyToOne(() => Occupation, { eager: true, nullable: true })
  @JoinColumn({ name: 'occupation_id' })
  occupation: Occupation;

  @Column({ nullable: true })
  occupation_id: number;
}
