/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingPhoto } from './entities/listing-photo.entity';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

@Module({
  imports: [
    TypeOrmModule.forFeature([ListingPhoto]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MulterModuleOptions => {
        const storage = new CloudinaryStorage({
          cloudinary,
          params: {
              folder: configService.get<string>('CLOUDINARY_FOLDER') || 'ecored',
              format: () => 'jpeg',
              public_id: (_req: Express.Request, file: Express.Multer.File) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                return `${file.fieldname}-${uniqueSuffix}`;
              },
            } as Record<string, unknown>,
          });

          return {
            storage,
            limits: {
              fileSize: 5 * 1024 * 1024,
            },
          };
        },
      }),
    ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
