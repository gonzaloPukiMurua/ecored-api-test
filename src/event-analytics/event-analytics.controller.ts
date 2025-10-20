/* eslint-disable prettier/prettier */
// src/event-analytics/event-analytics.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { EventAnalyticsService } from './event-analytics.service';
import { CreateEventDto } from './DTOs/create-event.dto';
import { EventAnalytics } from './entities/event-analytics.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Event Analytics')
@Controller('event-analytics')
export class EventAnalyticsController {
  constructor(private readonly eventService: EventAnalyticsService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un evento analítico' })
  @ApiResponse({ status: 201, description: 'Evento creado', type: EventAnalytics })
  async createEvent(@Body() dto: CreateEventDto): Promise<EventAnalytics> {
    return this.eventService.createEvent(dto);
  }
}
