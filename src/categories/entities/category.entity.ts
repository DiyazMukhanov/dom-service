import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Occupation } from '../../occupations/entities/occupation.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('float')
  price: number;

  @ManyToOne(() => Occupation, (occupation) => occupation.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'occupation_id' })
  occupation: Occupation;
}
