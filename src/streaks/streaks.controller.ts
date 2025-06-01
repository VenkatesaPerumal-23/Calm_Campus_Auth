import { Controller, Get, Post, Patch, Req, Query, UseGuards } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('streaks')
@UseGuards(JwtAuthGuard)
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get()
  async getStreak(@Query('userId') userId: string) {
    return this.streaksService.getStreak(userId);
  }

  @Post('track')
  async trackStreak(@Req() req) {
    return this.streaksService.trackStreak(req.user.user_id);
  }

  // @Patch('restore')
  // async restoreStreak(@Body() body: { userId: string, coinsUsed: number }) {
  //   return this.streaksService.restoreStreak(body.userId, body.coinsUsed);
  // }
}
