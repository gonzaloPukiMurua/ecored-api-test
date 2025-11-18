/* eslint-disable prettier/prettier */
import { IsUUID, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterEcopointDto {
  @ApiProperty()
  @IsUUID()
  user_id!: string;

  @ApiProperty()
  @IsUUID()
  action_name!: string;

  @ApiProperty()
  @IsUUID()
  category_id!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  extra_data?: Record<string, unknown>; // puedes pasar distancia, detalles, etc.
}
