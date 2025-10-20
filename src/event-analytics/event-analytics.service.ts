/* eslint-disable prettier/prettier */
// src/event-analytics/event-analytics.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventAnalytics } from './entities/event-analytics.entity';
import { CreateEventDto } from './DTOs/create-event.dto';
import { User } from '../user/entities/user.entity';
import { Listing } from '../listing/entities/listing.entity';
import { Request } from '../request/entities/request.entity';

@Injectable()
export class EventAnalyticsService {
  constructor(
    @InjectRepository(EventAnalytics)
    private readonly eventRepo: Repository<EventAnalytics>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
  ) {}

  async createEvent(dto: CreateEventDto): Promise<EventAnalytics> {
    const event = new EventAnalytics();
    event.event_type = dto.event_type;
    event.payload = dto.payload;

    if (dto.user_id) {
      const user = await this.userRepo.findOne({ where: { user_id: dto.user_id } });
      if (!user) throw new NotFoundException(`User con ID ${dto.user_id} no encontrado`);
      event.user = user;
    }

    if (dto.listing_id) {
      const listing = await this.listingRepo.findOne({ where: { listing_id: dto.listing_id } });
      if (!listing) throw new NotFoundException(`Listing con ID ${dto.listing_id} no encontrado`);
      event.listing = listing;
    }

    if (dto.request_id) {
      const request = await this.requestRepo.findOne({ where: { request_id: dto.request_id } });
      if (!request) throw new NotFoundException(`Request con ID ${dto.request_id} no encontrado`);
      event.request = request;
    }

    return this.eventRepo.save(event);
  }
}
