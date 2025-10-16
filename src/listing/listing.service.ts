/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './DTOs/create-listing.dto';
import { ListingRepository } from './listing.repository';
import { MediaService } from 'src/media/media.service';
import { ListingPhoto } from 'src/media/entities/listing-photo.entity';

@Injectable()
export class ListingService {
    constructor(
        private readonly listingRepository: ListingRepository,
        private readonly mediaService: MediaService
    ){}

    async createListing(createListingDto: CreateListingDto, files: Express.Multer.File[]){

        const photos: ListingPhoto[] = [];
        for(let i = 0; i < files.length; i++){
            const file = files[i];
            const url = this.mediaService.uploadFile(file);
            const photo = new ListingPhoto();
            photo.url = url;
            photo.position = i;
            photos.push(photo);
        }
        
        return await this.listingRepository.createListing({
            ...createListingDto,
            photos
        });
    }
}
