import { Module } from '@nestjs/common';
import { FriendRequestsService } from '../friendRequest/friendRequest.service';
import { FriendRequestsController } from '../friendRequest/friendRequest.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProgressService } from '../progress/progress.service';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports:[PrismaModule,AuthModule, ProgressModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService, PrismaService, ProgressService],
  exports: [FriendRequestsService],
})
export class FriendRequestsModule {}
