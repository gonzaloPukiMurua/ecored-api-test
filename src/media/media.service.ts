/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUD_NAME'),
      api_key: this.configService.get<string>('API_KEY'),
      api_secret: this.configService.get<string>('API_SECRET'),
    });
  }

  // Subida asincrónica
  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.configService.get<string>('CLOUDINARY_FOLDER') || 'ecored',
          format: 'jpeg',
          public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        },
        (error, result) => {
            if (error) return reject(new Error(error.message || 'Cloudinary upload failed'));
            resolve(result?.secure_url || '');
        },
      );

      // Convertimos buffer a stream y lo pasamos a Cloudinary
      const readable = new Readable();
      readable._read = () => {}; // required
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
