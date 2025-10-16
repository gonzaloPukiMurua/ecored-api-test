/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Listing } from "./entities/listing.entity";
import { Repository } from "typeorm";
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
}