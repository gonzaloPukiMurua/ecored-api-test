/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository, } from "@nestjs/typeorm";
import { EventAnalytics, EventType } from "./entities/event-analytics.entity";
import { Repository, SelectQueryBuilder  } from "typeorm";
@Injectable()
export class EventAnalyticsRepository {
  constructor(
    @InjectRepository(EventAnalytics)
    private readonly eventAnalyticsRepository: Repository<EventAnalytics>,
  ) {}

  async save(event: EventAnalytics): Promise<EventAnalytics>{
    return await this.eventAnalyticsRepository.save(event)
  }

  async findWithFilters(
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
  ): Promise<{ data: EventAnalytics[]; total: number; page: number; limit: number }> {
    const qb: SelectQueryBuilder<EventAnalytics> =
      this.eventAnalyticsRepository.createQueryBuilder('event')
        .leftJoinAndSelect('event.user', 'user')
        .leftJoinAndSelect('event.listing', 'listing')
        .leftJoinAndSelect('event.request', 'request')
        .orderBy('event.timestamp', order)
        .skip((page - 1) * limit)
        .take(limit);

    // Filtros opcionales
    if (filters.event_type) qb.andWhere('event.event_type = :event_type', { event_type: filters.event_type });
    if (filters.user_id) qb.andWhere('user.user_id = :user_id', { user_id: filters.user_id });
    if (filters.listing_id) qb.andWhere('listing.listing_id = :listing_id', { listing_id: filters.listing_id });
    if (filters.request_id) qb.andWhere('request.request_id = :request_id', { request_id: filters.request_id });
    if (filters.start_date) qb.andWhere('event.timestamp >= :start_date', { start_date: filters.start_date });
    if (filters.end_date) qb.andWhere('event.timestamp <= :end_date', { end_date: filters.end_date });

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }
}