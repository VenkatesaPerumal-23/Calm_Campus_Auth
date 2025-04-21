import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post('add')
  async addContact(@Body() body: { userId: number; contactId: number; type: 'friend' | 'professional' }) {
    return this.contactsService.addContact(body.userId, body.contactId, body.type);
  }

  @Get(':userId')
  async getUserContacts(@Param('userId', ParseIntPipe) userId: number) {
    return this.contactsService.getUserContacts(userId);
  }
}
