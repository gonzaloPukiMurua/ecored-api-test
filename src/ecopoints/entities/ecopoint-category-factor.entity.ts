/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Entity('ecopoint_category_factors')
export class EcopointCategoryFactor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ type: 'float' })
  factor_circular!: number;

  @Column({ default: true })
  active!: boolean;
}
