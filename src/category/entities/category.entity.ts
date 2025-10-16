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

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  category_id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => Category, (cat) => cat.children, { nullable: true })
  parent?: Category | null;

  @OneToMany(() => Category, (cat) => cat.parent)
  children?: Category[];

  @OneToMany(() => Listing, (listing) => listing.category)
  listings!: Listing[];

  @CreateDateColumn()
  created_at!: Date;
}
