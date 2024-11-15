import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.enableCors({
    origin: 'http://localhost:4200',  // Permite solicitudes desde este origen específico
    methods: 'GET,POST,PUT,DELETE, PATCH',   // Métodos HTTP permitidos
    credentials: true                 // Permitir credenciales (si aplican)
  });

  await app.listen(3000);
}
bootstrap();
