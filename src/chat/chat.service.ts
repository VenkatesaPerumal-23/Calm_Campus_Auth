import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

async getAllChats(userId: string, search?: string) {
  const whereClause: any = {
    OR: [
      { senderId: userId },
      { receiverId: userId },
    ],
  };

  if (search) {
    whereClause.content = {
      contains: search,
      //mode: 'insensitive',
    };
  }

  return this.prisma.message.findMany({
    where: whereClause,
    orderBy: { createdAt: 'asc' },
  });
}
  async getConversation(userId: string, friendId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async saveMessage(senderId: string, receiverId: string, content: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
  }
}
