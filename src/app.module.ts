import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ExampleController } from './example/example.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule accessible across the app
    }),
  ],
  controllers: [AuthController, ExampleController],
  providers: [AuthService, JwtStrategy],
})
export class AppModule {}
