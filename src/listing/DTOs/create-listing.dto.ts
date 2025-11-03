/* eslint-disable prettier/prettier */
// src/listing/dto/create-listing.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ItemCondition } from '../enums/item-condition.enum';

export class CreateListingDto {
  @ApiProperty({ example: 'Silla reciclada' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Silla hecha con madera reciclada, buen estado.' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({ example: 'uuid-de-la-categoria' })
  @IsUUID()
  category_id!: string;

  @ApiProperty({ example: 'uuid-de-la-subcategoria', required: false })
  @IsOptional()
  @IsUUID()
  subcategory_id?: string;

  @ApiProperty({ example: 'usable', enum: ItemCondition })
  @IsEnum(ItemCondition)
  item_condition!: ItemCondition;

  @ApiProperty({ example: -31.4201, required: false })
  @IsOptional()
  lat?: number;

  @ApiProperty({ example: -64.1888, required: false })
  @IsOptional()
  lng?: number;

  @ApiProperty({ example: 'Córdoba, Argentina', required: false })
  @IsOptional()
  zone_text?: string;
}
