/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, HttpException, BadRequestException, HttpStatus } from '@nestjs/common';
import { LoginUserDto } from 'src/user/DTOs/login-user.dto';
import { UserService } from 'src/user/user.service';
import { GenerateTokensProvider } from './generate-token.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/DTOs/create-user.dto';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly generateTokensProvider: GenerateTokensProvider,
        private readonly addressService: AddressService
    ){}

    async login(credentials: LoginUserDto){
        console.log(credentials);
        const user = await this.userService.findOneByEmail(credentials.email)
        if (!user) {
            throw new HttpException('No matches found', 404);
        }
        if (!user.password) {
            throw new BadRequestException();
        }
        const isPasswordMatching = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatching) {
            throw new HttpException(
                'wrong credentials provided',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const token = await this.generateTokensProvider.generateToken(user);
        return { token};
    }
    async register(credentials: CreateUserDto){
        
        const userExists = await this.userService.findOneByEmail( credentials.email);
        if(userExists){
            throw new HttpException(
                'Mail already registered', 
                HttpStatus.CONFLICT
            );
        }

        const newUser = await this.userService.createUserWithHashedPassword(credentials);
        
        if (credentials.address) {
            const addressEntity = await this.addressService.createAddress(credentials.address);
            await this.userService.addAddressToUser(newUser.user_id, addressEntity);
        }

        return {
            user_id: newUser.user_id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            created_at: newUser.created_at,
        };
    }
}
