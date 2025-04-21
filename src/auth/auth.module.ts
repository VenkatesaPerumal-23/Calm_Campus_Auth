import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';

import * as admin from 'firebase-admin';

import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../../firebase-account-service-key.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  projectId: serviceAccount.project_id,
});

console.log('Firebase Admin Initialized:', admin.apps.length > 0);
console.log('Firebase Project ID:', admin.app().options.projectId);

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule,AuthService],
})
export class AuthModule {}
