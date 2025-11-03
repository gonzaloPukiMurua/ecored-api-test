/* eslint-disable prettier/prettier */
// src/event-analytics/event-analytics.controller.ts
import { 
  Controller, 
  Post, 
  Body,
  Get,
  Query,
  UseGuards
 } from '@nestjs/common';
import { EventAnalyticsService } from './event-analytics.service';
import { CreateEventDto } from './DTOs/create-event.dto';
import { EventAnalytics } from './entities/event-analytics.entity';
import { EventType } from './enums/event-type.enum';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery 
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@ApiTags('Event Analytics')
@Controller('event-analytics')
export class EventAnalyticsController {
  constructor(private readonly eventService: EventAnalyticsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Crea un evento analítico' })
  @ApiResponse({ status: 201, description: 'Evento creado', type: EventAnalytics })
  @UseGuards(AccessTokenGuard)
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<EventAnalytics> {
    return this.eventService.createEvent(createEventDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Obtiene eventos con filtros, orden y paginación' })
  @ApiResponse({ status: 200, description: 'Lista de eventos', type: [EventAnalytics] })
  @ApiQuery({ name: 'event_type', required: false, enum: EventType })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @ApiQuery({ name: 'listing_id', required: false, type: String })
  @ApiQuery({ name: 'request_id', required: false, type: String })
  @ApiQuery({ name: 'start_date', required: false, type: String })
  @ApiQuery({ name: 'end_date', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], example: 'DESC' })
  async getEvents(
    @Query('event_type') event_type?: EventType,
    @Query('user_id') user_id?: string,
    @Query('listing_id') listing_id?: string,
    @Query('request_id') request_id?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.eventService.getEvents(
      {
        event_type,
        user_id,
        listing_id,
        request_id,
        start_date: start_date ? new Date(start_date) : undefined,
        end_date: end_date ? new Date(end_date) : undefined,
      },
      Number(page),
      Number(limit),
      order,
    );
  }
}
