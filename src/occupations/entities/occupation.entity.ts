import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('occupations')
export class Occupation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;
}
