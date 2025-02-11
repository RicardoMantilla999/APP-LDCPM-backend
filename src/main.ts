import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(',') || '*';

  // Configura CORS
  app.enableCors({
    origin: allowedOrigins, // Permite todos los orígenes en producción
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api/');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(parseInt(process.env.PORT));
}
bootstrap();
