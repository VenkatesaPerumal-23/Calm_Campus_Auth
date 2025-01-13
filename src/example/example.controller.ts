import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('example')
export class ExampleController {
  // A protected route that requires a valid JWT
  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtectedData() {
    return { message: 'This is protected data!' };
  }
}
