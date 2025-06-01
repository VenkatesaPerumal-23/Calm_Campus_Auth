import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from 'src/users/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'; 
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ProgressModule } from './progress/progress.module';
import { ArticlesModule } from './article/article.module';
import { EventsModule } from './events/events.module';
import { MapsModule } from './map/map.module';
import { FriendRequestsModule } from './friendRequest/friendRequest.module';
import { StreaksModule } from './streaks/streaks.module';
import { ContactsModule } from './contacts/contacts.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProgressModule,
    ArticlesModule,
    EventsModule,
    MapsModule,
    FriendRequestsModule,
    ContactsModule,
    StreaksModule,
    PrismaModule,
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule {}
