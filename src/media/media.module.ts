/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingPhoto } from './entities/listing-photo.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListingPhoto]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({ limits: { fileSize: 5 * 1024 * 1024 } }),
    }),
    ConfigModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
