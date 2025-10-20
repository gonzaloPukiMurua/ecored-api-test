/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RequestRepository } from './request.repository';
import { CreateRequestDto } from './DTOs/create-request.dto';
import { Request as RequestEntity, RequestStatus } from './entities/request.entity';
import { NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ListingService } from 'src/listing/listing.service';


@Injectable()
export class RequestService {

    constructor(
        private readonly requestRepository: RequestRepository,
        private readonly listinService: ListingService,
        private readonly userService: UserService, 
    ){}

    async createRequest(createDto: CreateRequestDto): Promise<RequestEntity> {

    const listing = await this.listinService.getListingById(createDto.listing_id);
    if (!listing) throw new NotFoundException(`Listing con ID ${createDto.listing_id} no encontrado`);

    const requester = await this.userService.findUserById(createDto.requester_id);
    if (!requester) throw new NotFoundException(`User con ID ${createDto.requester_id} no encontrado`);

    const request = await this.requestRepository.createRequest({
      listing,
      requester,
      status: RequestStatus.PENDING,
    });
    return request;
  }

  async updateRequest(id: string, status: string): Promise<RequestEntity> {
    const request = await this.requestRepository.findById(id);
    if (!request) throw new Error(`Request con ID ${id} no encontrada`);

    request.status = status as RequestStatus;
    return this.requestRepository.updateStatus(request, status);
  }
}
