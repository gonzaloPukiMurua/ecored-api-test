/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { ListingPhoto } from '../../media/entities/listing-photo.entity';
import { Request } from '../../request/entities/request.entity';

export enum ItemCondition {
  NEW = 'nuevo',
  LIKE_NEW = 'como_nuevo',
  USABLE = 'usable',
  PARTS = 'repuestos',
}

export enum ListingtStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  BLOCKED = 'blocked',
  DELIVERED = 'delivered',
}

@Entity('Listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  listing_id!: string;

  @ManyToOne(() => User, (user) => user.listings, { onDelete: 'CASCADE' })
  owner!: User;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => Category, (category) => category.listings, { nullable: false })
  category!: Category;

  @ManyToOne(() => Category, { nullable: true })
  subcategory?: Category;

  @Column({ type: 'enum', enum: ItemCondition })
  item_condition!: ItemCondition;

  @Column({ type: 'enum', enum: ListingtStatus, default: ListingtStatus.DRAFT })
  status!: ListingtStatus;

  @Column({ type: 'float', nullable: true })
  lat?: number;

  @Column({ type: 'float', nullable: true })
  lng?: number;

  @Column({ nullable: true })
  zone_text?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations
  @OneToMany(() => ListingPhoto, (photo) => photo.listing, { cascade: true })
  photos?: ListingPhoto[];

  @OneToMany(() => Request, (request) => request.product)
  requests!: Request[];
}
