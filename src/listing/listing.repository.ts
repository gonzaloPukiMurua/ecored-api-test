/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Listing } from "./entities/listing.entity";
import { Repository, ILike, FindOptionsWhere } from "typeorm";
@Injectable()
export class ListingRepository{
  constructor(
        @InjectRepository(Listing)
        private readonly listingRepository: Repository<Listing>
  ){}
  
  async createListing(listingData: Partial<Listing>): Promise<Listing> {
    const listing = this.listingRepository.create(listingData);
    return await this.listingRepository.save(listing);
  }

  async getListingById(listing_id: string): Promise<Listing | null | undefined>{
    return await this.listingRepository.findOne({
            where: { listing_id },
            relations: ['photos', 'category', 'subcategory'],
    });
  }

  async findAll(
        search: string,
        category?: string,
        page = 1,
        limit = 10,
        order: 'ASC' | 'DESC' = 'ASC',
    ): Promise<{data: Listing[], total: number, page: number, limit: number}>{
      const where: FindOptionsWhere<Listing> = {};
      if (search) where.title = ILike(`%${search}%`);
      if (category) where.category = { category_id: category } as unknown as FindOptionsWhere<Listing['category']>;; 
      const [data, total] = await this.listingRepository.findAndCount({
        where,
        order: { created_at: order },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['photos', 'category', 'subcategory'],
      });
      
      return {
        data, 
        total,
        page,
        limit
    };
  }

  async save(listing: Listing): Promise<Listing> {
    return await this.listingRepository.save(listing);
  }

}