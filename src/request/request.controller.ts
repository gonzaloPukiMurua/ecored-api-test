/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { 
  Controller, 
  Post, 
  Body, 
  Put, 
  Param, 
  UseGuards,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
  Get,
  Query
 } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './DTOs/create-request.dto';
import { UpdateRequestDto } from './DTOs/update-request.dto';
import { Request as RequestEntity, RequestStatus } from './entities/request.entity';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags,
  ApiQuery
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import type { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@ApiTags('Requests')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  // ✅ Crear una nueva request
  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Crea una request para un listing' })
  @ApiResponse({ status: 201, description: 'Request creada correctamente', type: RequestEntity })
  async createRequest(
    @Req() request: Request,
    @Body() createRequestDto: CreateRequestDto
  ): Promise<RequestEntity> {
    const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
    if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');

    try {
      return await this.requestService.createRequest(createRequestDto, userPayload.user_id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  // ✅ Actualizar estado de una request
  @Put(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Actualiza el status de una request' })
  @ApiResponse({ status: 200, description: 'Request actualizada correctamente', type: RequestEntity })
  async updateRequest(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ): Promise<RequestEntity> {
    const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
    if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');

    try {
      return await this.requestService.updateRequest(id, updateRequestDto.status);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  // ✅ Requests hechas por el usuario logueado
  @Get('made')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Devuelve las requests que he hecho' })
  @ApiResponse({ status: 200, type: [RequestEntity] })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], example: 'DESC' })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  async getRequestsMadeByMe(
    @Req() request: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query('status') status?: RequestStatus,
  ): Promise<{ data: RequestEntity[]; total: number; page: number; limit: number }> {
    const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
    if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');
    console.log("Estoy en request controller GET mine:")
    return this.requestService.getRequestsMadeByUser(
      userPayload.user_id,
      Number(page),
      Number(limit),
      order,
      status
    );
  }

  // ✅ Requests recibidas por mis publicaciones
  @Get('received')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Devuelve las requests hechas a mis publicaciones' })
  @ApiResponse({ status: 200, type: [RequestEntity] })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], example: 'DESC' })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  async getRequestsReceivedByMe(
    @Req() request: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query('status') status?: RequestStatus,
  ): Promise<{ data: RequestEntity[]; total: number; page: number; limit: number }> {
    const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
    if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');

    return this.requestService.getRequestsReceivedByUser(
      userPayload.user_id,
      Number(page),
      Number(limit),
      order,
      status
    );
  }
}
