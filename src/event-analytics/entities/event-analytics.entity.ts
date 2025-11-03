/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Listing } from '../../listing/entities/listing.entity';
import { Request } from '../../request/entities/request.entity';
import { EventType } from '../enums/event-type.enum';


@Entity('events_analytics')
export class EventAnalytics {
  @PrimaryGeneratedColumn('uuid')
  event_id!: string;

  @Column({ type: 'enum', enum: EventType })
  event_type!: EventType;

  @ManyToOne(() => User, (user) => user.events, { nullable: true })
  user?: User;

  @ManyToOne(() => Listing, { nullable: true })
  listing?: Listing;

  @ManyToOne(() => Request, { nullable: true })
  request?: Request;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;
}
