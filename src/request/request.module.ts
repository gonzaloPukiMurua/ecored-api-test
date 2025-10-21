/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { ListingModule } from 'src/listing/listing.module';
import { UserModule } from 'src/user/user.module';
import { RequestRepository } from './request.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    ListingModule,
    UserModule,
  ],
  controllers: [RequestController],
  providers: [RequestService, RequestRepository],
  exports: [RequestService, RequestRepository]
})
export class RequestModule {}
