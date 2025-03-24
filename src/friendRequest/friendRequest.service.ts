import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendRequestsService {
  constructor(private prisma: PrismaService) {}

  // Send Friend Request
  async sendFriendRequest(senderId: number, receiverId: number) {
    const existingRequest = await this.prisma.friendrequest.findFirst({
      where: { sender_id:senderId, receiver_id:receiverId, status: 'pending' },
    });

    if (existingRequest) throw new Error('Friend request already sent');

    return this.prisma.friendrequest.create({
      data: { sender_id:senderId, receiver_id:receiverId },
    });
  }

  // Accept Friend Request
  async acceptFriendRequest(requestId: number) {
    const request = await this.prisma.friendrequest.findUnique({ where: { id: requestId } });

    if (!request) throw new Error('Friend request not found');

    await this.prisma.$transaction([
      this.prisma.friendrequest.update({
        where: { id: requestId },
        data: { status: 'accepted' },
      }),
      this.prisma.friend.create({ data: { user_id: request.sender_id, friend_id: request.receiver_id } }),
      this.prisma.friend.create({ data: { user_id: request.receiver_id, friend_id: request.sender_id } }),
    ]);

    return { message: 'Friend request accepted' };
  }
}
