/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { Repository } from "typeorm";

@Injectable()
export class AddressRepository{
    constructor(@InjectRepository(Address) private readonly addressRepository: Repository<Address>){}

    async findAll(): Promise<Address[]>{
        return await this.addressRepository.find();
    }

    async findOne(id: string): Promise<Address | null | undefined>{
        return await this.addressRepository.findOne({
            where: { id },
        })
    }

    async save(address: Address): Promise<Address> {
        return await this.addressRepository.save(address);
      }
}