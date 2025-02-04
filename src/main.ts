import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/");

  //app.use('uploads', express.static(join(__dirname,'..','uploads')));
  app.use('media', express.static(path.join(__dirname, '..', 'media')));

  app.useStaticAssets(path.join(__dirname, '../media'));
  //app.useStaticAssets(path.join(__dirname, '../uploads'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(',') || ['http://localhost:4200'];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
  });

  await app.listen(3000);
}
bootstrap();
