/* eslint-disable prettier/prettier */
// src/event-analytics/event-analytics.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventAnalytics } from './entities/event-analytics.entity';
import { CreateEventDto } from './DTOs/create-event.dto';
import { UserService } from 'src/user/user.service';
import { Request } from '../request/entities/request.entity';
import { ListingService } from 'src/listing/listing.service';
import { RequestService } from 'src/request/request.service';


@Injectable()
export class EventAnalyticsService {
  constructor(
    @InjectRepository(EventAnalytics)
    private readonly eventRepository: Repository<EventAnalytics>,
    private readonly userService: UserService,
    private readonly listingService: ListingService,
    private readonly requestService: RequestService,
  ) {}
  
  async createEvent(dto: CreateEventDto): Promise<EventAnalytics> {
    const event = new EventAnalytics();
    event.event_type = dto.event_type;
    event.payload = dto.payload;

    if (dto.user_id) {
      const user = await this.userService.findUserById(dto.user_id);
      if (!user) throw new NotFoundException(`User con ID ${dto.user_id} no encontrado`);
      event.user = user;
    }

    if (dto.listing_id) {
      const listing = await this.listingService.getListingById(dto.listing_id);
      if (!listing) throw new NotFoundException(`Listing con ID ${dto.listing_id} no encontrado`);
      event.listing = listing;
    }

    if (dto.request_id) {
      const request = await this.requestService.getRequestById(dto.request_id);
      if (!request) throw new NotFoundException(`Request con ID ${dto.request_id} no encontrado`);
      event.request = request;
    }

    return this.eventRepository.save(event);
  }
}
