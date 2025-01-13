import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google-login')
  async googleLogin(@Body('idToken') idToken: string) {
    // Verifying Google token and generating JWT
    const userDetails = await this.authService.verifyGoogleToken(idToken);
    const token = await this.authService.generateJwtToken(userDetails);

    // Returning the JWT to the client
    return { message: 'Login successful', token };
  }
}
