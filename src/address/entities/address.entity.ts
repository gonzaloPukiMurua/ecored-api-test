/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  street!: string;

  @Column({ name: 'street_number', nullable: true })
  streetNumber?: string;

  @Column({ nullable: true })
  apartment?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column()
  city!: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode?: string;

  @Column()
  country!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToMany(() => User, (user) => user.addresses)
  users!: User[];
}
