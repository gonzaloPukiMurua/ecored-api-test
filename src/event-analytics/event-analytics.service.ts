/* eslint-disable prettier/prettier */
// src/event-analytics/event-analytics.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventAnalytics } from './entities/event-analytics.entity';
import { EventType } from './enums/event-type.enum';
import { CreateEventDto } from './DTOs/create-event.dto';
import { UserService } from 'src/user/user.service';
import { Request } from '../request/entities/request.entity';
import { ListingService } from 'src/listing/services/listing.service';
import { RequestService } from 'src/request/services/request.service';
import { EventAnalyticsRepository } from './event-analytics.repository';


@Injectable()
export class EventAnalyticsService {
  constructor(
    private readonly eventRepository: EventAnalyticsRepository,
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
      const listing = await this.listingService.getListingEntityById(dto.listing_id);
      event.listing = listing;
    }

    if (dto.request_id) {
      const request = await this.requestService.getRequestById(dto.request_id);
      if (!request) throw new NotFoundException(`Request con ID ${dto.request_id} no encontrado`);
      event.request = request;
    }

    return this.eventRepository.save(event);
  }
  async getEvents(
    filters: {
      event_type?: EventType;
      user_id?: string;
      listing_id?: string;
      request_id?: string;
      start_date?: Date;
      end_date?: Date;
    },
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    console.log("Estoy en event service GET findWithFilters")
    return await this.eventRepository.findWithFilters(filters, page, limit, order);
  }
}
