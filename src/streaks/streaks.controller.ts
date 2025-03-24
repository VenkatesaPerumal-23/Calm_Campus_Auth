import { Controller, Get, Post, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('streaks')
@UseGuards(JwtAuthGuard)
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  // Get user's streak details
  @Get()
  async getStreak(@Query('userId') userId: number) {
    return this.streaksService.getStreak(Number(userId));
  }

  // Mark daily activity (increments streak if eligible)
  @Post('track')
  async trackStreak(@Body() body: { userId: number }) {
    return this.streaksService.trackStreak(body.userId);
  }

  // Restore streak using coins
  @Patch('restore')
  async restoreStreak(@Body() body: { userId: number, coinsUsed: number }) {
    return this.streaksService.restoreStreak(body.userId, body.coinsUsed);
  }
}
