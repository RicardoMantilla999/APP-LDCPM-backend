import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { SupabaseService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [CloudinaryProvider, SupabaseService],
    exports: [CloudinaryProvider, SupabaseService],
})
export class CloudinaryModule { }
