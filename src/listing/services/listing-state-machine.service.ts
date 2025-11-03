/* eslint-disable prettier/prettier */
import { 
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
 } from '@nestjs/common';
import { RequestStateMachineService } from 'src/request/services/request-state-machine.service';
import { ListingStatus } from '../enums/listing-status.enum';
import { ListingService } from './listing.service';
import { RequestService } from 'src/request/services/request.service';
import { RequestStatus } from 'src/request/enums/request-status.enum';
import { Listing } from '../entities/listing.entity';

@Injectable()
export class ListingStateMachineService {
    constructor(
        @Inject(forwardRef(() => ListingService))
        private readonly listingService: ListingService,
        @Inject(forwardRef(() => RequestService))
        private readonly requestService: RequestService,
        @Inject(forwardRef(() => RequestStateMachineService))
        private readonly requestStateService: RequestStateMachineService
    ){}
    
    async transition(
        listing_id: string,
        newStatus: ListingStatus,
        requestStatusChange: boolean,
        user_id?: string, 
    ): Promise<Listing>{
        const listing = await this.listingService.getListingEntityById(listing_id);
        console.log("Este es el listing: ", listing);
        if(requestStatusChange){
            console.log("requestStatusChange: ", requestStatusChange);
            console.log("newStatus: ", newStatus)
            switch (newStatus){
                case ListingStatus.RESERVED:
                    if(listing.status !== ListingStatus.PUBLISHED){
                        throw new UnauthorizedException(`Solo se puede reservar un producto publicado.`)
                    }
                    break;
                case ListingStatus.CANCELLED:
                    if(listing.status !== ListingStatus.IN_TRANSIT){
                        throw new UnauthorizedException(`Solo se puede reservar un producto publicado.`)
                    }
                    break;
                case ListingStatus.COMMITTED:
                    if(listing.status !== ListingStatus.RESERVED){
                        throw new UnauthorizedException(`Solo se puede comprometer un producto reservado.`)
                    }
                    console.log("Estoy en COMMITED del switch case");
                    break;
                case ListingStatus.IN_TRANSIT:
                    if(listing.status !== ListingStatus.COMMITTED){
                        throw new UnauthorizedException(`Solo se puede despachar un producto comprometido.`);
                    }
                    break;
                case ListingStatus.DELIVERED:{
                    if(listing.status !== ListingStatus.IN_TRANSIT){
                        throw new UnauthorizedException(`Solo se puede entregar un producto en transito.`);
                    }
                    break;
                }
                case ListingStatus.PUBLISHED:{
                    break;
                }
                default: 
                throw new BadRequestException(`No se puede cambiar al estado: ${newStatus} `);
            }
        }else if(user_id === listing.owner.user_id){
            switch (newStatus){
                case ListingStatus.DRAFT:
                case ListingStatus.BLOCKED:
                case ListingStatus.PAUSED:
                case ListingStatus.CANCELLED: {
                    const requests = await this.requestService.getRequestsByListingId(listing_id);
                    if(requests){
                    for(let i = 0; requests.length; i++){
                        await this.requestStateService.transition(requests[i], RequestStatus.CANCELLED, true)
                    }}
                    break;
                }
                case ListingStatus.PUBLISHED:
                    break;
                default:
                    throw new BadRequestException('No se puede cambiar directamnete este estado por el publicante');
            }
        }else{
            throw new BadRequestException('No se puede realizar dicha operación.')
        }
        return await this.listingService.saveListingStatus(listing, newStatus);
    }
}