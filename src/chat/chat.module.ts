import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProgressModule } from 'src/progress/progress.module';
import { ProgressService } from 'src/progress/progress.service';

@Module({
  imports:[PrismaModule,AuthModule, ProgressModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, PrismaService, ProgressService],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}


