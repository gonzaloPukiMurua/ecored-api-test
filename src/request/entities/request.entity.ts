/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Product } from '../../listing/entities/listing.entity';
import { User } from '../../user/entities/user.entity';
import { Delivery } from '../../delivery/entities/delivery.entity';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  request_id!: string;

  @ManyToOne(() => Product, (product) => product.requests, { onDelete: 'CASCADE' })
  product!: Product;

  @ManyToOne(() => User, (user) => user.requests, { onDelete: 'CASCADE' })
  requester!: User;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status!: RequestStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne(() => Delivery, (delivery) => delivery.request)
  delivery?: Delivery;
}
