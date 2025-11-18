/* eslint-disable prettier/prettier */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Listing } from '../../listing/entities/listing.entity';
import { CategoryBlock } from '../enums/category-block.enum';
import { EcopointUserHistory } from 'src/ecopoints/entities/ecopoint-user-history.entity';
import { EcopointCategoryFactor } from 'src/ecopoints/entities/ecopoint-category-factor.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  category_id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({
    type: 'enum',
    enum: CategoryBlock,
    nullable: true, // ← ojo: las subcategorías pueden heredar el bloque del padre
  })
  block?: CategoryBlock | null;

  @Column({ default: true })
  active!: boolean;

  @ManyToOne(() => Category, (cat) => cat.children, { nullable: true })
  parent?: Category | null;

  @OneToMany(() => Category, (cat) => cat.parent)
  children?: Category[];

  @OneToMany(() => Listing, (listing) => listing.category)
  listings!: Listing[];

  @OneToMany(() => EcopointCategoryFactor, (factor) => factor.category)
  factors!: EcopointCategoryFactor[];

  @OneToMany(() => EcopointUserHistory, (history) => history.category)
  ecopointHistory!: EcopointUserHistory[];

  @CreateDateColumn()
  created_at!: Date;
}
