/* eslint-disable prettier/prettier */
// src/request/DTOs/update-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RequestStatus } from '../enums/request-status.enum';

export class UpdateRequestDto {
  @ApiProperty({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  status!: RequestStatus;
}