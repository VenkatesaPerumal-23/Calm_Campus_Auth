import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('upcoming')
  getUpcomingEvents() {
    return this.eventsService.getUpcomingEvents();
  }

  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(Number(id));
  }

  @Post('create')
  createEvent(@Body() body) {
    try{
      return this.eventsService.createEvent(body);
    }
    catch(error){
      console.log(error.message);
    }
    
  }

  @Post(':id/rsvp')
  rsvpToEvent(@Param('id') id: string, @Body() body) {
    return this.eventsService.rsvpToEvent(Number(id), Number(body.userId),body.userEmail);
  }
}
