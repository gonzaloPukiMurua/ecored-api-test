/* eslint-disable prettier/prettier */

import { 
    Controller, 
    Post, 
    UploadedFiles, 
    UseInterceptors, 
    Body, 
    Get, 
    Param, 
    Query 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateListingDto } from './DTOs/create-listing.dto';
import { ListingService } from './listing.service';
import { Listing } from './entities/listing.entity';
import { 
    ApiConsumes, 
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiQuery
} from '@nestjs/swagger';


@Controller('listing')
export class ListingController {
    constructor(private readonly listingService: ListingService){}
    
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
    async createListing(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createListingDto: CreateListingDto,
    ) {
        return this.listingService.createListing(createListingDto, files);
    }
    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un listing por su ID' })
    @ApiResponse({ status: 200, description: 'Listing encontrado', type: Listing })
    async getListingById(@Param('id') id: string): Promise<Listing> {
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
}
