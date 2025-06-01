import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { connect } from '@ngrok/ngrok'; 

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // ✅ Start ngrok tunnel after app starts
  const url = await connect({ addr: port, authtoken: process.env.NGROK_AUTHTOKEN });
  console.log(`🚀 Ngrok tunnel started at: ${url.url()}`);
}

bootstrap();
