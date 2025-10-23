/* eslint-disable prettier/prettier */

import { 
    Controller, 
    Post, 
    UploadedFiles, 
    UseInterceptors, 
    Body, 
    Get, 
    Param, 
    Query,
    Put,
    UseGuards,
    Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateListingDto } from './DTOs/create-listing.dto';
import { UpdateListingDto } from './DTOs/update-listing.dto';
import { ListingService } from './listing.service';
import { Listing } from './entities/listing.entity';
import { 
    ApiConsumes, 
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBearerAuth
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import type { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

ApiBearerAuth()
@Controller('listing')
export class ListingController {
    constructor(
        private readonly listingService: ListingService
    ){}

    @Post()
    @UseInterceptors(FilesInterceptor('files', 5))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    schema: {
        type: 'object',
        properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            category_id: { type: 'string' },
            subcategory_id: { type: 'string' },
            item_condition: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
            zone_text: { type: 'string' },
            files: { type: 'array', items: { type: 'string', format: 'binary' } },
            },
        },
    })
    @UseGuards(AccessTokenGuard)
    async createListing(
    @Req() request: Request,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createListingDto: CreateListingDto,
    ) {
        const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
        try{  
            if (!userPayload) {
                return { message: 'Usuario no autenticado' };
            }
        }catch(error){
            console.error(error);
            return { message: 'Error interno del servidor' }
        }
        return this.listingService.createListing(createListingDto, userPayload.user_id, files);
    }
    
    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un listing por su ID' })
    @ApiResponse({ status: 200, description: 'Listing encontrado', type: Listing })
    async getListingById(@Param('id') id: string): Promise<Listing> {
        console.log("Estoy en listing Post.");
        return await this.listingService.getListingById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Obtiene listados con filtros, búsqueda, orden y paginación' })
    @ApiQuery({ name: 'search', required: false, description: 'Filtra por título o descripción' })
    @ApiQuery({ name: 'category', required: false, description: 'Filtra por categoría' })
    @ApiQuery({ name: 'page', required: false, description: 'Número de página', type: Number })
    @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de resultados por página', type: Number })
    @ApiQuery({ name: 'order', required: false, description: 'Orden ASC o DESC', enum: ['ASC', 'DESC'] })
    @ApiResponse({ status: 200, description: 'Listado de publicaciones', type: [Listing] })
    async getListings(
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    ): Promise<{ data: Listing[]; total: number; page: number; limit: number }> {
        return await this.listingService.getListings(search ?? '', category, Number(page), Number(limit), order);
  }

  // ✅ PUT /api/listing/update
  @Put('update')
  @ApiOperation({ summary: 'Actualiza un listing existente' })
  @ApiResponse({ status: 200, description: 'Listing actualizado', type: Listing })
  async updateListing(@Body() updateDto: UpdateListingDto): Promise<Listing> {
    return await this.listingService.updateListing(updateDto);
  }

  // ✅ PUT /api/listing/:id → borrado lógico
  @Put(':id')
  @ApiOperation({ summary: 'Borrado lógico de un listing por ID' })
  async softDeleteListing(@Param('id') id: string) {
    return await this.listingService.softDeleteListing(id);
  }

}
