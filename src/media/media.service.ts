/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService {
    uploadFile(file: Express.Multer.File): string {
        return file.path;
    }

    async deleteFile(publicId: string): Promise<void>{
        await cloudinary.uploader.destroy(publicId);
    }
}
