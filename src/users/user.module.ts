import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module'; // Ensure AuthModule is imported

@Module({
  imports: [PrismaModule,JwtModule.register({}),AuthModule],
  controllers: [UsersController],
  providers: [UsersService,JwtAuthGuard],
})
export class UsersModule {}
