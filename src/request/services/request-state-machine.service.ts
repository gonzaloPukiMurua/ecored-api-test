/* eslint-disable prettier/prettier */
import { 
  Injectable, 
  ForbiddenException,
  Inject,
  forwardRef
} from '@nestjs/common';
import { RequestStatus } from '../enums/request-status.enum';
import { ListingStatus } from 'src/listing/enums/listing-status.enum';
import { Request } from '../entities/request.entity';
import { ListingStateMachineService } from 'src/listing/services/listing-state-machine.service';
import { RequestService } from './request.service';

@Injectable()
export class RequestStateMachineService {
  constructor(
    @Inject(forwardRef(() => RequestService))
    private readonly requestService: RequestService,
    @Inject(forwardRef(() => ListingStateMachineService))
    private readonly listingStateService: ListingStateMachineService
  ) {}

  async transition(
    request: Request,
    newStatus: RequestStatus,
    listingStatusChange: boolean,
    user_id?: string, 
  ): Promise<Request> {
    console.log("Estoy en la machina de estado de request, newStatus: ", newStatus);
    if(listingStatusChange){
      console.log("Estoy en el if listingStatusChange, vengo de un cambio de estado de listing")
      switch (newStatus){
        case RequestStatus.CANCELLED:
          if(request.listing.status === ListingStatus.IN_TRANSIT){
            throw new ForbiddenException('No se puede cancelar un producto en tránsito.');
          }
          break;
        default:
          break;
      }
    }else if(user_id === request.publisher.user_id){
      console.log("Estoy en el if user publisher, soy el publicante")
      switch (newStatus){
        case RequestStatus.ACCEPTED:
          await this.listingStateService.transition(request.listing.listing_id, ListingStatus.COMMITTED, true, );
          break;
        case RequestStatus.IN_TRANSIT:
          await this.listingStateService.transition(request.listing.listing_id, ListingStatus.IN_TRANSIT, true);
          break;
        case RequestStatus.REJECTED:
          await this.listingStateService.transition(request.listing.listing_id, ListingStatus.PUBLISHED, true);
          break;
        default:
          throw new ForbiddenException('El publicante solo puede ACEPTAR, RECHAZAR o DESPACHAR la transacción');
      }
    }else if(user_id === request.requester.user_id){
      console.log("Estoy en el segundo if, soy el interesado")
      switch (newStatus){
        case RequestStatus.PENDING:
          await this.listingStateService.transition(request.listing.listing_id, ListingStatus.RESERVED, true);
          break;
        case RequestStatus.CANCELLED:
          await this.listingStateService.transition(request.listing.listing_id, ListingStatus.PUBLISHED, true);
          break;
        case RequestStatus.COMPLETED:
          await this.listingStateService.transition(request.listing.listing_id, ListingStatus.DELIVERED, true);
          break;
        default:
          throw new ForbiddenException('El interesado solo puede INICIAR, CANCELAR o COMPLETAR la transacción');
      }
    }
    else{
      throw new ForbiddenException('No hay estado valido.');
    }  
    return await this.requestService.saveStatusUpdate(request, newStatus);
  }
}