import { Controller, Get, Post, Query, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  async getAllChats(@Req() req: Request, @Query('search') search?: string) {
    const user = req.user as { userId: string };
    return this.chatService.getAllChats(user.userId, search);
  }

  @Get(':friendId')
  async getChatWithFriend(@Req() req: Request, @Param('friendId') friendId: string) {
    const user = req.user as { userId: string };
    return this.chatService.getConversation(user.userId, friendId);
  }

  @Post()
  async sendMessage(@Body() dto: SendMessageDto) {
    return this.chatService.saveMessage(dto.senderId, dto.receiverId, dto.content);
  }
}
