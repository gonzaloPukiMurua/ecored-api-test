/* eslint-disable prettier/prettier */

import { Controller, Post, UploadedFiles, UseInterceptors, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateListingDto } from './DTOs/create-listing.dto';
import { ListingService } from './listing.service';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('listing')
export class ListingController {
    constructor(private readonly listingService: ListingService){}
    
    @Post()
    @UseInterceptors(FilesInterceptor('files', 5))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    schema: {
        type: 'object',
        properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            category_id: { type: 'string' },
            subcategory_id: { type: 'string' },
            item_condition: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
            zone_text: { type: 'string' },
            files: { type: 'array', items: { type: 'string', format: 'binary' } },
            },
        },
    })
    async createListing(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createListingDto: CreateListingDto,
    ) {
        return this.listingService.createListing(createListingDto, files);
    }
}
