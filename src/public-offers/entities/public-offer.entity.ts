import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PublicOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
