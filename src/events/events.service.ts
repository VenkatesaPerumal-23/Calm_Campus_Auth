import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  // Get all upcoming events
  async getUpcomingEvents(){
    return this.prisma.event.findMany({
      where: {
        date: {
          gte: new Date(), // fetch future events
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  // Get event by ID
  async getEventById(id: number){
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  // Create new event
  async createEvent(data: { 
    title: string; 
    description: string; 
    image_url: string; 
    contents: { about: string; date: Date; time: string; location: string }[];
  }) {
    const { title, description, image_url, contents } = data;
  
    const eventData = {
      title,
      description,
      image_url,
      about: contents[0]?.about,
      date: contents[0]?.date, 
      time: contents[0]?.time,
      location: contents[0]?.location,
    };
  
    return this.prisma.event.create({
      data: eventData,
    });
  }  

  // RSVP to an event
  async rsvpToEvent(eventId: number, userId: number,userEmail:string) {
    return this.prisma.rsvp.create({
      data: { eventId, userId, userEmail }
    });
  }
}
