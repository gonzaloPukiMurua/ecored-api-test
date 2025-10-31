/* eslint-disable prettier/prettier */
// src/event-analytics/DTOs/create-event.dto.ts
import { IsEnum, IsOptional, IsUUID, IsObject } from 'class-validator';
import { EventType } from '../entities/event-analytics.entity';

export class CreateEventDto {
  @IsEnum(EventType)
  event_type!: EventType;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  listing_id?: string;

  @IsOptional()
  @IsUUID()
  request_id?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
