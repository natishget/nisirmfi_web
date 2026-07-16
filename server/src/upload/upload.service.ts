import { Injectable } from '@nestjs/common';
import cloudinary from './config/cloudinary';

@Injectable()
export class UploadService {
  async uploadToCloudinary(file: Express.Multer.File) {
    try {
      return await cloudinary.uploader.upload(file.path);
    } catch (e: any) {
      throw new Error(`Failed to upload file to Cloudinary: ${e.message}`);
    }
  }

  async deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
  }
}
