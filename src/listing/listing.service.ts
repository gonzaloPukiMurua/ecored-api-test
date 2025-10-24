/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListingDto } from './DTOs/create-listing.dto';
import { UpdateListingDto } from './DTOs/update-listing.dto';
import { ListingRepository } from './listing.repository';
import { MediaService } from 'src/media/media.service';
import { ListingPhoto } from 'src/media/entities/listing-photo.entity';
import { Listing, ListingStatus} from './entities/listing.entity';
import { CategoryService } from 'src/category/category.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ListingService {
    constructor(
        private readonly listingRepository: ListingRepository,
        private readonly mediaService: MediaService,
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
    ){}

    async createListing(createListingDto: CreateListingDto, user_id: string, files?: Express.Multer.File[]){
        console.log("Estos son los files: ", files);
        const photos: ListingPhoto[] = [];

        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = await this.mediaService.uploadFile(file);
                const photo = new ListingPhoto();
                photo.url = url;
                photo.position = i;
                photos.push(photo);
            }
         }

        const category = await this.categoryService.getCategoryById(createListingDto.category_id);
        if (!category) throw new NotFoundException('Categoría no encontrada');

        const user = await this.userService.findUserById(user_id);
        if(!user) throw new NotFoundException('Usuario no encontrado.');

        return await this.listingRepository.createListing({
            ...createListingDto,
            owner: user,
            category,
            photos
        });
    }

    async getListingById(id: string): Promise<Listing> {
        const listing = await this.listingRepository.getListingById(id);
        if (!listing) throw new NotFoundException(`Listing con ID ${id} no encontrado`);
        if (listing.status !== ListingStatus.PUBLISHED){
            throw new NotFoundException(`Listing con ID ${id} no está disponible públicamente`);
        }
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

    async getPublicListings(
        search: string,
        category?: string,
        page = 1,
        limit = 10,
        order: 'ASC' | 'DESC' = 'ASC',
    ) {
    const { data, total, page: p, limit: l } = await this.listingRepository.findAllPublished(
        search,
        category,
        page,
        limit,
        order,
    );
        return { data, total, page: p, limit: l };
    }

    async getListingsByOwnerId(ownerId: string): Promise<Listing[]> {
        return await this.listingRepository.findByOwnerId(ownerId);
    }

    async getListingsByOwnerAndStatus(ownerId: string, statuses: ListingStatus[]): Promise<Listing[]> {
        return await this.listingRepository.findByOwnerAndStatuses(ownerId, statuses);
    }

    // ✅ Actualizar un Listing
    async updateListing(updateDto: UpdateListingDto): Promise<Listing> {
        const listing = await this.listingRepository.getListingById(updateDto.listing_id);
        if (!listing) throw new NotFoundException('Listing no encontrado');

        Object.assign(listing, updateDto);
        return await this.listingRepository.save(listing);
    }

    // ✅ Borrado lógico
    async softDeleteListing(id: string): Promise<{ message: string }> {
        const listing = await this.listingRepository.getListingById(id);
        if (!listing) throw new NotFoundException('Listing no encontrado');

        listing.active = false;
        await this.listingRepository.save(listing);

        return { message: `Listing ${id} marcado como inactivo` };
    }
}
