/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { MediaModule } from 'src/media/media.module';
import { ListingRepository } from './listing.repository';
import { CategoryModule } from 'src/category/category.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { RequestModule } from 'src/request/request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing]),
    MediaModule,
    CategoryModule,
    UserModule,
    JwtModule,
    RequestModule,
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [ListingController],
  providers: [ListingService, ListingRepository],
  exports: [ListingService, ListingRepository]
})
export class ListingModule {}
