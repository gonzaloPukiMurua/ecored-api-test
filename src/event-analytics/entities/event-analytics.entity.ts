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

export enum EventType {
  USER_SIGNED_UP = 'UserSignedUp',
  PUBLICATION_CREATED = 'PublicationCreated',
  VIEW = 'View',
  SEARCH_PERFORMED = 'SearchPerformed',
  REQUEST_SENT = 'RequestSent',
  REQUEST_ACCEPTED = 'RequestAccepted',
  REQUEST_REJECTED = 'RequestRejected',
  REQUEST_CANCELLED = 'RequestCancelled',
  REQUEST_IN_TRANSIT = 'RequestInTransit',
  REQUEST_COMPLETED = 'RequestCompleted',
  REQUEST_EXPIRED = 'RequestExpired',
  CONTACT_CLICKED = 'ContactClicked',
  DELIVERY_CONFIRMED = 'DeliveryConfirmed',
  REPORT_SUBMITTED = 'ReportSubmitted',
}

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
