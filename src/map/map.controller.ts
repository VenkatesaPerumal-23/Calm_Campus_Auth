import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { MapsService } from './map.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('maps')
@UseGuards(JwtAuthGuard)
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  // 1. Get all users
  @Get('users')
  getAllUsers() {
    return this.mapsService.getAllUsers();
  }

  // 2. Get all users from a specific country
  @Get('users/country/:country')
  getUsersByCountry(@Param('country') country: string) {
    return this.mapsService.getUsersByCountry(country);
  }

  // 3. Get current user's friends from a specific country
  @Get('friends/country/:country')
  getFriendsFromCountry(@Param('country') country: string, @Req() req: Request) {
    const userId = req.user['userId']; // userId from JWT
    return this.mapsService.getFriendsFromCountry(userId, country);
  }
}
