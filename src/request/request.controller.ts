/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './DTOs/create-request.dto';
import { UpdateRequestDto } from './DTOs/update-request.dto';
import { Request as RequestEntity } from './entities/request.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Requests')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un request para un listing' })
  @ApiResponse({ status: 201, description: 'Request creada correctamente', type: RequestEntity })
  async createRequest(@Body() createRequestDto: CreateRequestDto): Promise<RequestEntity> {
    return this.requestService.createRequest(createRequestDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza el status de una request' })
  @ApiResponse({ status: 200, description: 'Request actualizada correctamente', type: RequestEntity })
  async updateRequest(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ): Promise<RequestEntity> {
    return this.requestService.updateRequest(id, updateRequestDto.status);
  }
}

