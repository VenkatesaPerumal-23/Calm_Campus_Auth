import { Module } from '@nestjs/common';
import { MapsService } from './map.service';
import { MapsController } from './map.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule,AuthModule],
  controllers: [MapsController],
  providers: [MapsService, PrismaService],
})
export class MapsModule {}
