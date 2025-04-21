import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateCountryDto } from './dto/update-country';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('displayName') displayName?: string,
  ) {
    return this.usersService.findAll({displayName});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  } 
 
  @Patch(':user_id/country')
  async updateCountry(
    @Param('user_id') user_id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.usersService.updateCountry(user_id, updateCountryDto);
  }
}
