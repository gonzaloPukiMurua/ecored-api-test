/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Listing } from '../../listing/entities/listing.entity';

@Entity('listing_photo')
export class ListingPhoto {
  @PrimaryGeneratedColumn('uuid')
  photo_id!: string;

  @ManyToOne(() => Listing, (listing) => listing.photos, {
    onDelete: 'CASCADE',
  })
  listing!: Listing;

  @Column()
  url!: string;

  @Column({ default: 0 })
  position!: number;

  @CreateDateColumn()
  created_at!: Date;
}
