import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { connect } from '@ngrok/ngrok'; 

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
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
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // ✅ Start ngrok tunnel after app starts
  const url = await connect({ addr: port, authtoken: process.env.NGROK_AUTHTOKEN });
  console.log(`🚀 Ngrok tunnel started at: ${url.url()}`);
}

bootstrap();
