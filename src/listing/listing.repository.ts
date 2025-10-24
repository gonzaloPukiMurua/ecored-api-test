/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Listing, ListingStatus } from "./entities/listing.entity";
import { Repository, ILike, FindOptionsWhere } from "typeorm";
import { In } from 'typeorm';

@Injectable()
export class ListingRepository {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async createListing(listingData: Partial<Listing>): Promise<Listing> {
    const listing = this.listingRepository.create(listingData);
    return await this.listingRepository.save(listing);
  }

  async getListingById(listing_id: string): Promise<Listing | null | undefined> {
    return await this.listingRepository.findOne({
      where: { listing_id },
      relations: ['photos', 'category', 'subcategory', 'owner'],
    });
  }

  async findAll(
    search: string,
    category?: string,
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Listing[]; total: number; page: number; limit: number }> {
    const where: FindOptionsWhere<Listing> = {};

    if (search) where.title = ILike(`%${search}%`);
    if (category)
      where.category = { category_id: category } as unknown as FindOptionsWhere<Listing['category']>;

    const [data, total] = await this.listingRepository.findAndCount({
      where,
      order: { created_at: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['photos', 'category', 'subcategory', 'owner'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async save(listing: Listing): Promise<Listing> {
    return await this.listingRepository.save(listing);
  }

  // ✅ 1. Obtener solo listings publicados y activos (para feed público)
  async findAllPublished(
    search: string,
    category?: string,
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Listing[]; total: number; page: number; limit: number }> {
    const qb = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.photos', 'photos')
      .leftJoinAndSelect('listing.category', 'category')
      .leftJoinAndSelect('listing.subcategory', 'subcategory')
      .leftJoinAndSelect('listing.owner', 'owner')
      .where('listing.active = :active', { active: true })
      .andWhere('listing.status = :status', { status: ListingStatus.PUBLISHED });

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

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  // ✅ 2. Obtener todos los listings creados por un usuario
  async findByOwnerId(ownerId: string): Promise<Listing[]> {
    return await this.listingRepository.find({
      where: { owner: { user_id: ownerId } },
      relations: ['photos', 'category', 'subcategory'],
      order: { created_at: 'DESC' },
    });
  }

  // ✅ 3. Obtener listings de un usuario filtrados por estado
  async findByOwnerAndStatuses(
    ownerId: string,
    statuses: ListingStatus[],
  ): Promise<Listing[]> {
    const where: FindOptionsWhere<Listing> = {
      owner: { user_id: ownerId },
      ...(statuses.length > 0 && { status: In(statuses) }),
    };

    return this.listingRepository.find({
      where,
      relations: ['photos', 'category', 'subcategory'],
      order: { created_at: 'DESC' },
    });
  }
}
