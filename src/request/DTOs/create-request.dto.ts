/* eslint-disable prettier/prettier */
// src/request/DTOs/create-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ description: 'ID del listing que se desea solicitar' })
  @IsUUID()
  listing_id!: string;

  @ApiProperty({ description: 'ID del usuario que realiza la solicitud' })
  @IsUUID()
  requester_id!: string;
}