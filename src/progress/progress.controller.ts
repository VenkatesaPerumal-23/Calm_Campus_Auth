import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Endpoint to get progress by userId
  @Get(':userId')
  async getProgress(@Param('userId') userId: string) {
    return this.progressService.getProgress(userId);
  }
}
