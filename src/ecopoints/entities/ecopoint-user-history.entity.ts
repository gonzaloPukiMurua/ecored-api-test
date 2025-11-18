/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { EcopointAction } from './ecopoint-action.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity('ecopoint_user_history')
export class EcopointUserHistory {
  @PrimaryGeneratedColumn('uuid')
  eco_user_id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => EcopointAction, { nullable: false })
  @JoinColumn({ name: 'action_id' })
  action!: EcopointAction;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ type: 'int' })
  points_action!: number;

  @Column({ type: 'float' })
  factor_category!: number;

  @Column({ type: 'float' })
  points_total!: number;

  @Column({ type: 'json', nullable: true })
  extra_data?: any;

  @CreateDateColumn()
  created_at!: Date;
}
