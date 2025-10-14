/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './DTOs/create-adress.dto';
import { Address } from './entities/address.entity';
@Injectable()
export class AddressService {
    constructor(private readonly addressRepository: AddressRepository){}
    
    async createAddress(createAddressDto: CreateAddressDto){
        const address = new Address();
        Object.assign(address, createAddressDto);
        return await this.addressRepository.save(address);
    }
}
