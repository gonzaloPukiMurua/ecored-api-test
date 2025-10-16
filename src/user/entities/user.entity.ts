/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany
} from 'typeorm';
import { Listing } from '../../listing/entities/listing.entity';
import { Request } from '../../request/entities/request.entity';
import { Report } from '../../report/entities/report.entity';
import { EventAnalytics } from '../../event-analytics/entities/event-analytics.entity';
import { Address } from 'src/address/entities/address.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ default: false })
  is_verified!: boolean;

  @Column()
  password!: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Relations

  @ManyToMany(() => Address, (address) => address.users, {
      cascade: true,
  })
  @JoinTable({
    name: 'user_address',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'address_id', referencedColumnName: 'id' },
    })
  addresses!: Address[];
  
  @OneToMany(() => Listing, (listing) => listing.owner)
  listings!: Listing[] ;

  @OneToMany(() => Request, (request) => request.requester)
  requests!: Request[];

  @OneToMany(() => Report, (report) => report.reporter)
  reports!: Report[];

  @OneToMany(() => EventAnalytics, (event) => event.user)
  events!: EventAnalytics[];
}
