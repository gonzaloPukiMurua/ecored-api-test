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
    UnauthorizedException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateListingDto } from './DTOs/create-listing.dto';
import { UpdateListingDto } from './DTOs/update-listing.dto';
import { ListingService } from './services/listing.service';
import { Listing} from './entities/listing.entity';
import { ListingStatus } from './enums/listing-status.enum';

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
import { EventAnalyticsService } from 'src/event-analytics/event-analytics.service';
import { EventType } from 'src/event-analytics/enums/event-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { EcoPointsService } from 'src/ecopoints/services/ecopoints.service';

ApiBearerAuth()
@Controller('listing')
export class ListingController {
    constructor(
        private readonly listingService: ListingService,
        private readonly eventAnalyticsService: EventAnalyticsService,
        private readonly ecopointsService: EcoPointsService
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
        if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');

        const listing = await this.listingService.createListing(createListingDto, userPayload.user_id, files);
        console.log("Category Id: ", listing.category.category_id)
        try {
            await this.ecopointsService.registerAction({
                user_id: userPayload.user_id,
                action_name: 'Publicar', // Nombre exacto de la acción correspondiente
                category_id: listing.category.category_id, // obtiene factor según categoría
                extra_data: { listing_id: listing.listing_id },
            });
        } catch (error) {
            console.error('❌ Error registrando EcoPoints PUBLICAR_PRODUCTO:', error);
        }

        this.eventAnalyticsService.createEvent({
            event_type: EventType.PUBLICATION_CREATED,
            user_id: userPayload.user_id,
            listing_id: listing.listing_id,
            payload: {
                title: createListingDto.title,
                category_id: createListingDto.category_id,
                subcategory_id: createListingDto.subcategory_id,
                hasImages: !!files?.length,
            location: {
                lat: createListingDto.lat,
                lng: createListingDto.lng,
                zone_text: createListingDto.zone_text,
            },
            },
        }).catch((err) => console.error('Error registrando evento LISTING_CREATED:', err));
        return listing;
    }
    
    @Get('/details/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Obtiene un listing por su ID' })
    @ApiResponse({ status: 200, description: 'Listing encontrado', type: Listing })
    async getListingById(
        @Param('id') id: string,
        @Req() request: Request
    ): Promise<Listing> {
        console.log("Estoy en listing Post. Id del producto: ", id);
        const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
        if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');
        await this.eventAnalyticsService.createEvent({
                event_type: EventType.VIEW,
                user_id: userPayload.user_id,
                listing_id: id,
                payload: {
                source: 'details-view',
            },
        });
        return await this.listingService.getPublishedListingById(id, userPayload.user_id);
    }

    @Get()
    @Auth(AuthType.Optional)
    @ApiOperation({ summary: 'Obtiene listados con filtros, búsqueda, orden y paginación' })
    @ApiQuery({ name: 'search', required: false, description: 'Filtra por título o descripción' })
    @ApiQuery({ name: 'category', required: false, description: 'Filtra por categoría' })
    @ApiQuery({ name: 'page', required: false, description: 'Número de página', type: Number })
    @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de resultados por página', type: Number })
    @ApiQuery({ name: 'order', required: false, description: 'Orden ASC o DESC', enum: ['ASC', 'DESC'] })
    @ApiResponse({ status: 200, description: 'Listado de publicaciones', type: [Listing] })
    async getListings(
        @Req() request: Request,
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('order') order: 'ASC' | 'DESC' = 'ASC',
       
    ) {
        const userPayload = request[REQUEST_USER_KEY] as JwtPayload | undefined;

        console.log("Estoy en listing GET")
        const listings = await this.listingService.getPublicListings(search ?? '', category, page, limit, order);
    
        if(userPayload){
            await this.eventAnalyticsService.createEvent({
            event_type: EventType.SEARCH_PERFORMED,
            user_id: userPayload?.user_id,
            payload: {
                search: search ?? null,
                category: category ?? null,
                page,
                limit,
                order,
                total_results: listings.total,
                },
            });
        }

        return listings;
    }

  // GET /listing/mine
    @Get('mine')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Obtiene todas las publicaciones creadas por el usuario autenticado' })
    async getMyListings(@Req() request: Request) {
        console.log("Estoy en listing/mine GET")
        const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
        if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');
        return await this.listingService.getListingsByOwnerId(userPayload.user_id);
    }

    // GET /listing/mine/committed
    @Get('mine/committed')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Obtiene publicaciones del usuario autenticado con estado comprometido/en tránsito' })
    async getMyCommittedListings(@Req() request: Request) {
        const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
        if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');
        return await this.listingService.getListingsByOwnerAndStatus(userPayload.user_id, [ListingStatus.COMMITTED, ListingStatus.IN_TRANSIT]);
    }

    // ✅ PUT /api/listing/update
    @Put('update/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Actualiza un listing existente' })
    @ApiResponse({ status: 200, description: 'Listing actualizado', type: Listing })
    async updateListing(
        @Param('id') listing_id: string,
        @Body() updateDto: UpdateListingDto,
        @Req() request: Request
    ): Promise<Listing> {
        const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
        if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');
        return await this.listingService.updateListing(listing_id, updateDto, userPayload.user_id);
    }

    // ✅ PUT /api/listing/:id → borrado lógico
    @Put('delete/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Borrado lógico de un listing por ID' })
    async softDeleteListing(
        @Param('id') id: string, 
        @Req() request: Request
    ) {
        console.log("Estoy en listing PUT soft delete");
        const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
        if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');
        return await this.listingService.softDeleteListing(id, userPayload.user_id);
    }

    @Put('update/status/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Cambia el estado de una publicación y actualiza las requests asociadas si aplica' })
    @ApiResponse({ status: 200, description: 'Estado del listing actualizado', type: Listing })
    async updateListingStatus(
        @Req() request: Request,
        @Param('id') id: string,
        @Body('status') status: ListingStatus,
    ) {
    const userPayload = request[REQUEST_USER_KEY] as JwtPayload;
    if (!userPayload) throw new UnauthorizedException('Usuario no autenticado');
        return await this.listingService.updateListingStatus(id, status, userPayload.user_id);
    }

}
