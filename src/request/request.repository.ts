/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "./entities/request.entity";
import { Repository } from "typeorm";
import { RequestStatus } from "./entities/request.entity";

@Injectable()
export class RequestRepository{
    constructor( 
        @InjectRepository(Request)
        private readonly requestRepository: Repository<Request>
    ){}

    async createRequest(data: Partial<Request>): Promise<Request> {
    const request = this.requestRepository.create(data);
    return this.requestRepository.save(request);
  }

  async findById(id: string): Promise<Request | null> {
    return this.requestRepository.findOne({
      where: { request_id: id },
      relations: ['listing', 'requester', 'delivery'],
    });
  }

  async updateStatus(request: Request, status: string): Promise<Request> {
    request.status = status as RequestStatus;
    return this.requestRepository.save(request);
  }

}