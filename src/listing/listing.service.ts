/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListingDto } from './DTOs/create-listing.dto';
import { ListingRepository } from './listing.repository';
import { MediaService } from 'src/media/media.service';
import { ListingPhoto } from 'src/media/entities/listing-photo.entity';
import { Listing } from './entities/listing.entity';

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

    async getListingById(id: string): Promise<Listing>{
        const listing = await this.listingRepository.getListingById(id);
        if (!listing) throw new NotFoundException(`Listing con ID ${id} no encontrado`);
        return listing;
    }

    async getListings(
        search: string,
        category?: string,
        page = 1,
        limit = 10,
        order: 'ASC' | 'DESC' = 'ASC',
    ): Promise<{data: Listing[], total: number, page: number, limit: number}>{

        const { data, total, page: p, limit: l } = await this.listingRepository.findAll(search, category, page, limit, order);
        return { data: data || [], total, page: p, limit: l };
    }
}
