import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class SupabaseService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
          cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
      }
    
      async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: folder, resource_type: 'image' },
            (error, result) => {
              if (error) {
                console.error('⛔ Error al subir la imagen a Cloudinary:', error);
                reject(error);
              } else {
                console.log('✅ Imagen subida con éxito:', result.secure_url);
                resolve(result.secure_url);
              }
            },
          );
    
          const readableStream = new Readable();
          readableStream.push(file.buffer);
          readableStream.push(null);
          readableStream.pipe(uploadStream);
        });
      }

  
}
