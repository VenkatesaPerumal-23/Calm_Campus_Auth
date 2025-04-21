import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friendRequest.service';
import { FriendRequestsController } from './friendRequest.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[PrismaModule,AuthModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService, PrismaService],
  exports: [FriendRequestsService],
})
export class FriendRequestsModule {}
