/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Listing } from '../../listing/entities/listing.entity';
import { User } from '../../user/entities/user.entity';
import { Delivery } from '../../delivery/entities/delivery.entity';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  request_id!: string;

  @ManyToOne(() => Listing, (listing) => listing.requests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id', referencedColumnName: 'listing_id' })
  listing!: Listing;

  // Usuario que hizo la solicitud
  @ManyToOne(() => User, (user) => user.requests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requester_id', referencedColumnName: 'user_id' })
  requester!: User;

  // Usuario dueño del listing
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'publisher_id', referencedColumnName: 'user_id' })
  publisher!: User;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status!: RequestStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne(() => Delivery, (delivery) => delivery.request)
  delivery?: Delivery;

  @Column({ default: true })
  active!: boolean; // opcional, según tus necesidades
}
