import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {

    async uploadImage(file: Express.Multer.File, folder: string): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: folder, resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        console.error('⛔ Error al subir la imagen a Cloudinary:', error);
                        reject(error);
                    } else {
                        console.log('✅ Imagen subida con éxito:', result.secure_url);
                        resolve(result);
                    }
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);

        });
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`✅ Imagen eliminada en Cloudinary: ${publicId}`);
        } catch (error) {
            console.error(`⛔ Error al eliminar imagen en Cloudinary: ${error.message}`);
            throw new InternalServerErrorException('Error al eliminar la imagen en Cloudinary');
        }
    }


    extractPublicId(imageUrl: string): string {
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1].split('.')[0]; // Obtiene el nombre sin extensión
        return `${parts[parts.length - 2]}/${filename}`; // Retorna el `public_id`
    }





}
