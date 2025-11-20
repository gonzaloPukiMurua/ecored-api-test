/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";
import { Request } from "./entities/request.entity";
import { RequestStatus } from "./enums/request-status.enum";

@Injectable()
export class RequestRepository {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>
  ) {}

  async createRequest(data: Partial<Request>): Promise<Request> {
    const request = this.requestRepository.create(data);
    return this.requestRepository.save(request);
  }

  async findById(id: string): Promise<Request | null | undefined> {
    return this.requestRepository.findOne({
      where: { request_id: id },
      relations: [
        'listing',
        'listing.category', 
        'requester', 
        'publisher', 
        'delivery'
      ],
    });
  }

  async updateStatus(request: Request, status: string): Promise<Request> {
    request.status = status as RequestStatus;
    return this.requestRepository.save(request);
  }

  async findByRequesterId(
    user_id: string,
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'DESC',
    status?: RequestStatus
  ): Promise<{ data: Request[]; total: number; page: number; limit: number }> {
    const where: FindOptionsWhere<Request> = {
      requester: { user_id },
    };

    if (status) {
      where.status = status;
    }

    const [data, total] = await this.requestRepository.findAndCount({
      where,
      order: { created_at: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: [
        'listing',
        'listing.category',
        'requester', 
        'delivery'
      ],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findByPublisherId(
    publisher_id: string,
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'DESC',
    status?: RequestStatus
  ): Promise<{ data: Request[]; total: number; page: number; limit: number }> {
    const where: FindOptionsWhere<Request> = { publisher: { user_id: publisher_id } };

    if (status) {
      where.status = status;
    }

    const [data, total] = await this.requestRepository.findAndCount({
      where,
      order: { created_at: order },
      skip: (page - 1) * limit,
      take: limit,
      relations: [
        'listing',
        'listing.category', 
        'requester', 
        'publisher', 
        'delivery'
      ],
    });

    return { data, total, page, limit };
  }

  async findByListingId(listingId: string): Promise<Request[]> {
    return this.requestRepository.find({
      where: { listing: { listing_id: listingId } },
      relations: [
        'listing',
        'listing.category', 
        'requester', 
        'publisher'
      ],
    });
  }

  async save(request: Request): Promise<Request>{
    return await this.requestRepository.save(request);
  }

}
