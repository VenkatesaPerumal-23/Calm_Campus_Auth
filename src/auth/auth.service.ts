import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(private readonly jwtService: JwtService) {}

  // Verify the Google token received from the client
  async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload) throw new UnauthorizedException('Invalid token');

      // Extracting user info
      const { sub, email, name, picture } = payload;
      return { userId: sub, email, name, picture };
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  // Generate JWT token for the user
  async generateJwtToken(userDetails: { email: string; name: string }) {
    const payload = { email: userDetails.email, name: userDetails.name };
    return this.jwtService.sign(payload);
  }
}
