/* eslint-disable prettier/prettier */
import { 
    forwardRef,
    Inject,
    Injectable, 
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { CreateListingDto } from './DTOs/create-listing.dto';
import { UpdateListingDto } from './DTOs/update-listing.dto';
import { ListingRepository } from './listing.repository';
import { MediaService } from 'src/media/media.service';
import { ListingPhoto } from 'src/media/entities/listing-photo.entity';
import { Listing, ListingStatus} from './entities/listing.entity';
import { CategoryService } from 'src/category/category.service';
import { UserService } from 'src/user/user.service';
import { RequestService } from 'src/request/request.service';
import { User } from 'src/user/entities/user.entity';
import { ListingResponseDto } from './DTOs/listing-response.dto';

@Injectable()
export class ListingService {
    constructor(
        private readonly listingRepository: ListingRepository,
        private readonly mediaService: MediaService,
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => RequestService))
        private readonly requestService: RequestService,
    ){}

    async createListing(
        createListingDto: CreateListingDto, 
        user_id: string, 
        files?: Express.Multer.File[]): Promise<ListingResponseDto>
        {
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

    async getListingEntityById(listing_id: string): Promise<Listing>{
        const listing = await this.listingRepository.getEntityById(listing_id);
        if (!listing) throw new NotFoundException(`Listing con ID ${listing_id} no encontrado`);
        return listing;
    }

    async getListingById(id: string): Promise<ListingResponseDto> {

        const listing = await this.listingRepository.getListingDtoById(id);
        if (!listing) throw new NotFoundException(`Listing con ID ${id} no encontrado`);
        return listing;
    }

    async getPublishedListingById(id: string, user_id: string): Promise<ListingResponseDto>{
        const user = await this.userService.findUserById(user_id);
        const listing = await this.getListingById(id);

        console.log("Usuario logueado: ", user.user_id);
        console.log("Listing: ", listing.owner.user_id);
        if(listing.status !== ListingStatus.PUBLISHED && user.user_id !== listing.owner.user_id){
            console.log("Listing no publico.");
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
    ): Promise<{data: ListingResponseDto[], total: number, page: number, limit: number}>{

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

    console.log("Datos de DB: ", data);
        return { data, total, page: p, limit: l };
    }

    async getListingsByOwnerId(ownerId: string): Promise<ListingResponseDto[]> {
        return await this.listingRepository.findByOwnerId(ownerId);
    }

    async getListingsByOwnerAndStatus(ownerId: string, statuses: ListingStatus[]): Promise<ListingResponseDto[]> {
        return await this.listingRepository.findByOwnerAndStatuses(ownerId, statuses);
    }

    async updateListing(listing_id: string, updateDto: UpdateListingDto, user_id: string): Promise<ListingResponseDto> {

        const user = await this.userService.findUserById(user_id);

        const listing = await this.listingRepository.getEntityById(updateDto.listing_id);
        if(!listing) throw new NotFoundException(`Listing con ID ${updateDto.listing_id} no está disponible.`);
        this.ensureUserIsOwner(user, listing);

        Object.assign(listing, updateDto);
        return await this.listingRepository.save(listing);
    }

    async softDeleteListing(listingId: string, user_id: string): Promise<{ message: string }> {

        const user = await this.userService.findUserById(user_id);

        const listing = await this.listingRepository.getEntityById(listingId);
        if(!listing) throw new NotFoundException(`Listing con ID ${listingId} no está disponible.`);
        this.ensureUserIsOwner(user, listing);

        listing.active = false;
        await this.listingRepository.save(listing);

        return { message: `Listing ${listingId} marcado como inactivo` };
    }

    async updateListingStatusOnNewRequest(listing_id: string): Promise<ListingResponseDto>{
        const listing = await this.listingRepository.getEntityById(listing_id);
        if(!listing) throw new NotFoundException(`Listing con ID ${listing_id} no está disponible.`);
        listing.status = ListingStatus.RESERVED;
        const saved = await this.listingRepository.save(listing);
        return saved;
    }

    async updateListingStatus(listing_id: string, newStatus: ListingStatus, userId: string): Promise<ListingResponseDto> {

        const user = await this.userService.findUserById(userId);

        const listing = await this.listingRepository.getEntityById(listing_id);

        if(!listing) throw new NotFoundException(`Listing con ID ${listing_id} no está disponible.`);

        this.ensureUserIsOwner(user, listing);

        listing.status = newStatus;
        const saved = await this.listingRepository.save(listing);

        if (newStatus === ListingStatus.CANCELLED) {
            await this.requestService.cancelRequestsByListingId(listing_id);
        } else if (newStatus === ListingStatus.EXPIRED) {
            await this.requestService.expireRequestsByListingId(listing_id);
        }

        return saved;
    }

    private ensureUserIsOwner(user: User, listing: Listing) {
        if (!listing.owner || user.user_id !== listing.owner.user_id) {
            throw new UnauthorizedException('El usuario no es el creador de la publicación');
        }
    }
}
