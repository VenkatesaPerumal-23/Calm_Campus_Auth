import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      console.log("error");  
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    console.log(token);
    let jwtSecretKey = process.env.JWT_SECRET;
    try {
      const decoded = this.jwtService.verify(token,{ secret: jwtSecretKey });
      console.log(decoded);
      request.user = decoded; 
      return true;
    } catch (error) {
      console.error('❌ JWT verification failed:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
