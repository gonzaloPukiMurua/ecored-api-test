/* eslint-disable prettier/prettier */
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateListingDto } from './create-listing.dto';
import { IsUUID } from 'class-validator';

export class UpdateListingDto extends PartialType(CreateListingDto) {
     @ApiProperty({
        description: 'ID del listing a actualizar',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    listing_id!: string;
}