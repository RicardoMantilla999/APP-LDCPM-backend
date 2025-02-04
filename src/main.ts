import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configura CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:4200', // Permite solicitudes desde este origen
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS', // Incluye OPTIONS para preflight
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true, // Permite credenciales (cookies, tokens)
  });

  app.setGlobalPrefix('api/');
  app.use('media', express.static(path.join(__dirname, '..', 'media')));
  app.useStaticAssets(path.join(__dirname, '../media'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(3000);
}
bootstrap();
