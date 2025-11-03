/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RequestRepository } from '../request.repository';
import { CreateRequestDto } from '../DTOs/create-request.dto';
import { Request as RequestEntity } from '../entities/request.entity';
import { RequestStatus } from '../enums/request-status.enum';
import { UserService } from 'src/user/user.service';
import { ListingService } from 'src/listing/services/listing.service';
import { RequestStateMachineService } from './request-state-machine.service';

@Injectable()
export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    @Inject(forwardRef(() => ListingService)) 
    private readonly listingService: ListingService,
    @Inject(forwardRef(() => RequestStateMachineService)) 
    private readonly requestStateService: RequestStateMachineService,
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
    return this.requestRepository.findByRequesterId(user_id, page, limit, order, status);
  }

  async createRequest(createDto: CreateRequestDto, requester_id: string): Promise<RequestEntity> {

    const listing = await this.listingService.getListingEntityById(createDto.listing_id);
    const requester = await this.userService.findUserById(requester_id);
    console.log("Esta es el listing por el cual se realiza la petición: ", listing);
    const publisher = listing.owner;
    console.log("El publisher es: ", publisher);
    console.log("El requester es: ", requester)
    if (!publisher) throw new NotFoundException(`El listing con ID ${listing.listing_id} no tiene un owner válido`);
    const request = await this.requestRepository.createRequest({
      listing,
      requester,
      publisher,
      active: true,
    });

    const updatedListing = await this.requestStateService.transition(request, RequestStatus.PENDING, false, requester.user_id);
    console.log("listing actualizado: ", updatedListing);
    return request;
  }

  async updateStatus(requestId: string, user_id: string, newStatus: RequestStatus): Promise<RequestEntity> {

    const request = await this.requestRepository.findById(requestId);
    if (!request) throw new NotFoundException(`Request ${requestId} no encontrada`);

    const user = await this.userService.findUserById(user_id);
    if(!user) throw new NotFoundException(`User con id ${requestId} no encontrado`);
    console.log(newStatus)
    return await this.requestStateService.transition(request, newStatus, false, user.user_id);

  }

  async saveStatusUpdate(request: RequestEntity, newStatus: RequestStatus): Promise<RequestEntity>{
    console.log("Estoy en saveStatusUpdate de request");
    console.log("status: ", newStatus);
    console.log("Request es: ", request);
    request.status = newStatus;
    return await this.requestRepository.save(request);
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

  async getRequestsByListingId(listing_id: string){
    return await this.requestRepository.findByListingId(listing_id);
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
    return this.requestRepository.findByRequesterId(user_id, page, limit, order, status);
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
