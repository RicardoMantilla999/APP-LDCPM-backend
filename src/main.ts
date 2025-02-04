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
  app.use('media', express.static(path.join(__dirname,'..','media')));

  app.useStaticAssets(path.join(__dirname, '../media'));
  //app.useStaticAssets(path.join(__dirname, '../uploads'));
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN,  // Permite solicitudes desde este origen específico
    //origin: 'https://backend-ldcpm-pnydajamg-ricardomantillas-projects.vercel.app/api/';
    methods: 'GET,POST,PUT,DELETE, PATCH',   // Métodos HTTP permitidos
    credentials: true                 // Permitir credenciales (si aplican)
  });

  await app.listen(3000);
}
bootstrap();
