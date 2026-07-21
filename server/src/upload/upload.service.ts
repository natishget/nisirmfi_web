import { Injectable } from '@nestjs/common';
import cloudinary from './config/cloudinary';
import { Readable } from 'stream';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  async uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'nisirmfi' },
        (error, result) => {
          if (error) return reject(new Error(`Failed to upload file to Cloudinary: ${error.message}`));
          if (!result) return reject(new Error('Upload to Cloudinary failed: result is undefined'));
          resolve(result);
        }
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(upload);
    });
  }

  async deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
  }
}
