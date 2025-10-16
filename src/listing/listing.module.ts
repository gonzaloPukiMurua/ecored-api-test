/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing]),
    MediaModule,
  ],
  controllers: [ListingController],
  providers: [ListingService],
})
export class ListingModule {}
