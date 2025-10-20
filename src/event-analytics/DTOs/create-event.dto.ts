/* eslint-disable prettier/prettier */
// src/event-analytics/dto/create-event.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsObject } from 'class-validator';
import { EventType } from '../entities/event-analytics.entity';

export class CreateEventDto {
  @ApiProperty({ enum: EventType, description: 'Tipo de evento' })
  @IsEnum(EventType)
  event_type!: EventType;

  @ApiProperty({ description: 'ID del usuario relacionado', required: false })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ description: 'ID del listing relacionado', required: false })
  @IsUUID()
  @IsOptional()
  listing_id?: string;

  @ApiProperty({ description: 'ID del request relacionado', required: false })
  @IsUUID()
  @IsOptional()
  request_id?: string;

  @ApiProperty({ description: 'Payload adicional', required: false })
  @IsObject()
  @IsOptional()
  payload?: Record<string, any>;
}
