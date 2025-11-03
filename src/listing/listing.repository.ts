/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository} from "typeorm";
import { Listing } from "./entities/listing.entity";
import { ListingStatus } from "./enums/listing-status.enum";
import { ListingResponseDto } from "./DTOs/listing-response.dto";

@Injectable()
export class ListingRepository {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  // ✅ Mapper actualizado con photos
  private mapToDto = (listing: Listing | null): ListingResponseDto | null => {
    if (!listing) return null;
    return {
      listing_id: listing.listing_id,
      title: listing.title,
      description: listing.description,
      owner: listing.owner ? { user_id: listing.owner.user_id } : { user_id: '' },
      category: listing.category
        ? { category_id: listing.category.category_id, name: listing.category.name }
        : { category_id: '', name: '' },
      subcategory: listing.subcategory
        ? { category_id: listing.subcategory.category_id, name: listing.subcategory.name }
        : { category_id: '', name: '' },
      photos: listing.photos
        ? listing.photos.map(p => ({
            photo_id: p.photo_id,
            url: p.url,
            position: p.position,
          }))
        : [],
      status: listing.status,
      created_at: listing.created_at,
      updated_at: listing.updated_at,
      active: listing.active,
    };
  };

  async createListing(listingData: Partial<Listing>): Promise<ListingResponseDto> {
    const listing = this.listingRepository.create(listingData);
    const saved = await this.listingRepository.save(listing);
    return this.mapToDto(saved)!;
  }

  async getListingDtoById(listing_id: string): Promise<ListingResponseDto | null> {
    const listing = await this.listingRepository.findOne({
      where: { listing_id },
      relations: ['owner', 'category', 'subcategory', 'photos'], // ✅ incluimos fotos
    });
    return this.mapToDto(listing);
  }

  async findAll(
    search?: string,
    category?: string,
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: ListingResponseDto[]; total: number; page: number; limit: number }> {
    const qb = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.owner', 'owner')
      .leftJoinAndSelect('listing.category', 'category')
      .leftJoinAndSelect('listing.subcategory', 'subcategory')
      .leftJoinAndSelect('listing.photos', 'photos') // ✅ fotos
      .where('listing.active = true');

    if (search) {
      qb.andWhere('(listing.title ILIKE :search OR listing.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (category) {
      qb.andWhere('category.category_id = :category', { category });
    }

    qb.orderBy('listing.created_at', order)
      .skip((page - 1) * limit)
      .take(limit);

    const [listings, total] = await qb.getManyAndCount();
    return {
      data: listings.map(l => this.mapToDto(l)!).filter(Boolean),
      total,
      page,
      limit,
    };
  }

  async findAllPublished(
    search?: string,
    category?: string,
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: ListingResponseDto[]; total: number; page: number; limit: number }> {
    const qb = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.owner', 'owner')
      .leftJoinAndSelect('listing.category', 'category')
      .leftJoinAndSelect('listing.subcategory', 'subcategory')
      .leftJoinAndSelect('listing.photos', 'photos') // ✅ fotos
      .where('listing.active = true')
      .andWhere('listing.status = :status', { status: ListingStatus.PUBLISHED });
    console.log(qb)
    if (search) {
      qb.andWhere('(listing.title ILIKE :search OR listing.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (category) {
      qb.andWhere('category.category_id = :category', { category });
    }

    qb.orderBy('listing.created_at', order)
      .skip((page - 1) * limit)
      .take(limit);

    const [listings, total] = await qb.getManyAndCount();
    return {
      data: listings.map(l => this.mapToDto(l)!).filter(Boolean),
      total,
      page,
      limit,
    };
  }

  async findByOwnerId(ownerId: string): Promise<ListingResponseDto[]> {
    const listings = await this.listingRepository.find({
      where: { owner: { user_id: ownerId } },
      relations: ['owner', 'category', 'subcategory', 'photos'], // ✅ fotos incluidas
      order: { created_at: 'DESC' },
    });

    return listings.map(l => this.mapToDto(l)!).filter(Boolean);
  }

  async findByOwnerAndStatuses(ownerId: string, statuses: ListingStatus[]): Promise<ListingResponseDto[]> {
    const qb = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoin('listing.owner', 'owner')
      .leftJoin('listing.category', 'category')
      .leftJoin('listing.subcategory', 'subcategory')
      .where('owner.user_id = :ownerId', { ownerId });

    if (statuses && statuses.length > 0) {
      qb.andWhere('listing.status IN (:...statuses)', { statuses });
    }

    qb.orderBy('listing.created_at', 'DESC')
      .select([
        'listing.listing_id',
        'listing.title',
        'listing.description',
        'listing.status',
        'listing.created_at',
        'owner.user_id',
        'category.category_id',
        'category.name',
        'subcategory.category_id',
        'subcategory.name',
      ]);
    const listings = await qb.getMany();
    return listings.map(l => this.mapToDto(l)!).filter(Boolean);
  }

  async getEntityById(listing_id: string): Promise<Listing | null> {
    return await this.listingRepository.findOne({
      where: { listing_id },
      relations: ['owner', 'category', 'subcategory', 'photos', 'requests'],
    });
  }

  async saveEntity(listing: Listing): Promise<Listing> {
    return await this.listingRepository.save(listing);
  }

  async save(listing: Listing): Promise<ListingResponseDto> {
    const saved = await this.listingRepository.save(listing);
    return this.mapToDto(saved)!;
  }
}

