import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MapsService } from './map.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('maps')
@UseGuards(JwtAuthGuard)
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('user-density')
  async getUserDensity() {
    return this.mapsService.getUserDensity();
  }

  @Get('country/:countryCode')
  async getCountryDetails(@Param('countryCode') countryCode: string) {
    return this.mapsService.getCountryDetails(countryCode);
  }

  //we can also get user's friends from particular country --- API
}
