import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('User Authentication')
  .setDescription(
    'The API details for the User Authentication application using Firebase in the NestJS backend.',
  )
  .setVersion('1.0')
  .addTag('Authentication')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe()); 
  app.enableCors();  // Enable CORS for cross-origin requests
  await app.listen(process.env.PORT); 
}
bootstrap();
