/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { RequestRepository } from './request.repository';
import { CreateRequestDto } from './DTOs/create-request.dto';
import { Request as RequestEntity, RequestStatus } from './entities/request.entity';
import { UserService } from 'src/user/user.service';
import { ListingService } from 'src/listing/listing.service';
import { ListingStatus } from 'src/listing/entities/listing.entity';

@Injectable()
export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly listingService: ListingService,
    private readonly userService: UserService,
  ) {}

  async getRequestById(id: string): Promise<RequestEntity | null | undefined> {
    return await this.requestRepository.findById(id);
  }

  async getRequestsByUserId(
    user_id: string,
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'DESC',
    status?: RequestStatus,
  ): Promise<{ data: RequestEntity[]; total: number; page: number; limit: number }> {
    return this.requestRepository.findByUserId(user_id, page, limit, order, status);
  }

  async createRequest(createDto: CreateRequestDto, requester_id: string): Promise<RequestEntity> {
    // 1️⃣ Buscar el listing solicitado
    const listing = await this.listingService.getListingById(createDto.listing_id);
    if (!listing) throw new NotFoundException(`Listing con ID ${createDto.listing_id} no encontrado`);

    // 2️⃣ Buscar al usuario que hace la solicitud
    const requester = await this.userService.findUserById(requester_id);
    if (!requester) throw new NotFoundException(`Usuario con ID ${requester_id} no encontrado`);

    // 3️⃣ Obtener el publisher desde el listing
    const publisher = listing.owner;
    if (!publisher) throw new NotFoundException(`El listing con ID ${listing.listing_id} no tiene un owner válido`);

    // 4️⃣ Crear la request con requester + publisher
    const request = await this.requestRepository.createRequest({
      listing,
      requester,
      publisher,
      status: RequestStatus.PENDING,
      active: true,
    });

    return request;
  }

  async updateRequest(id: string, status: string): Promise<RequestEntity> {
    const request = await this.requestRepository.findById(id);
    if (!request) throw new NotFoundException(`Request con ID ${id} no encontrada`);

    request.status = status as RequestStatus;
    return this.requestRepository.updateStatus(request, status);
  }

  async updateRequestStatus(requestId: string, newStatus: RequestStatus): Promise<RequestEntity> {
    const request = await this.requestRepository.findById(requestId);
    if (!request) throw new NotFoundException('Request no encontrada');

    request.status = newStatus;
    const updated = await this.requestRepository.updateStatus(request, newStatus);

    // 🔁 Sincronizar listing
    switch (newStatus) {
      case RequestStatus.ACCEPTED:
        await this.listingService.updateListingStatus(request.listing.listing_id, ListingStatus.COMMITTED, request.publisher.user_id);
        break;
      case RequestStatus.IN_TRANSIT:
        await this.listingService.updateListingStatus(request.listing.listing_id, ListingStatus.IN_TRANSIT, request.publisher.user_id);
        break;
      case RequestStatus.COMPLETED:
        await this.listingService.updateListingStatus(request.listing.listing_id, ListingStatus.DELIVERED, request.publisher.user_id);
        break;
      case RequestStatus.REJECTED:
      case RequestStatus.CANCELLED:
      case RequestStatus.EXPIRED:
        await this.listingService.updateListingStatus(request.listing.listing_id, ListingStatus.PUBLISHED, request.publisher.user_id);
        break;
    }

    return updated;
  }


  async cancelRequestsByListingId(listingId: string): Promise<void> {
    const requests = await this.requestRepository.findByListingId(listingId);
    if (!requests || requests.length === 0) return;

    for (const req of requests) {
      if (req.status !== RequestStatus.CANCELLED && req.status !== RequestStatus.COMPLETED) {
        req.status = RequestStatus.CANCELLED;
        await this.requestRepository.updateStatus(req, RequestStatus.CANCELLED);
      }
    }
  }

  async expireRequestsByListingId(listingId: string): Promise<void> {
    const requests = await this.requestRepository.findByListingId(listingId);
    if (!requests || requests.length === 0) return;

    for (const req of requests) {
      if (req.status !== RequestStatus.CANCELLED && req.status !== RequestStatus.COMPLETED) {
        req.status = RequestStatus.CANCELLED;
        await this.requestRepository.updateStatus(req, RequestStatus.CANCELLED);
      }
    }
  }

  async getRequestsMadeByUser(
  user_id: string,
  page = 1,
  limit = 10,
  order: 'ASC' | 'DESC' = 'DESC',
  status?: RequestStatus,
) {
  return this.requestRepository.findByUserId(user_id, page, limit, order, status);
}

  async getRequestsReceivedByUser(
    publisher_id: string,
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'DESC',
    status?: RequestStatus,
  ) {
    return this.requestRepository.findByPublisherId(publisher_id, page, limit, order, status);
  }
}
