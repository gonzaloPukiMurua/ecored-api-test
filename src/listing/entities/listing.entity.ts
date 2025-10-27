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

export enum ListingStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  RESERVED = 'reserved',
  COMMITTED = 'committed',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  BLOCKED = 'blocked',
  EXPIRED = 'expired',
} 

@Entity('listings')
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

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.DRAFT })
  status!: ListingStatus;

  @Column({ type: 'float', nullable: true, default: null })
  lat?: number | null;

  @Column({ type: 'float', nullable: true, default: null })
  lng?: number | null;

  @Column({ nullable: true })
  zone_text?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ default: true })
  active!: boolean;

  // Relations
  @OneToMany(() => ListingPhoto, (photo) => photo.listing, { cascade: true })
  photos?: ListingPhoto[];

  @OneToMany(() => Request, (request) => request.listing)
  requests!: Request[];
}
