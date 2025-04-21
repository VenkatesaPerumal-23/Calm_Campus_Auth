import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { user_id, email, name, picture, fcmToken } = loginDto;
    console.log("user_id:", user_id);

    try {
      let user = await this.prisma.users.findUnique({ where: { user_id } });

      if (!user) {
        console.log("User not found, creating new user.");
        user = await this.prisma.users.create({
          data: {
            email,
            displayName: name,
            photoUrl: picture,
            user_id,
            fcmToken, 
          },
        });
        console.log('User created:', user);
      } else {
        console.log("User found, updating FCM token.");
        // update FCM token if changed or present
        await this.prisma.users.update({
          where: { user_id },
          data: { fcmToken },
        });
      }

      const payload = { user_id, email, picture, name };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (error) {
      console.error('Token verification failed:', error.code, error.message);
      if (error.code === 'auth/id-token-expired') {
        throw new Error('ID Token has expired');
      }
      throw new UnauthorizedException('Invalid Firebase ID Token');
    }
  }
}
