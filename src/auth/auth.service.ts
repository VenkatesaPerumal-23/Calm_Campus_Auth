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
    const { user_id,email,name,picture } = loginDto;
    console.log("user_id:", user_id);
    try {
      console.log("inside");
      let user = await this.prisma.users.findUnique({ where: { user_id } });
      console.log(user);
      if (!user) {
        console.log("inside database");
        user = await this.prisma.users.create({
          data: { email, displayName: name, photoUrl: picture, user_id: user_id},
        });
        console.log('User created:', user);
      }

      const payload = {user_id: user_id,email,picture,name};
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
