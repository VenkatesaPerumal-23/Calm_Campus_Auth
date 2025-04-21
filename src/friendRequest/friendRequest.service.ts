import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as admin from 'firebase-admin';
import { join } from 'path';


admin.initializeApp({
  credential: admin.credential.cert(
    require(join(__dirname, '../../firebase-service-account.json'))
  ),
});

@Injectable()
export class FriendRequestsService {
  constructor(private prisma: PrismaService) {}

  // 🔔 Utility function to send FCM notification
  private async sendNotification(fcmToken: string, title: string, body: string) {
    if (!fcmToken) return;

    const message = {
      notification: { title, body },
      token: fcmToken,
    };

    try {
      await admin.messaging().send(message);
    } catch (err) {
      console.error('FCM send error:', err);
    }
  }

  // 📩 Send Friend Request
  async sendFriendRequest(senderId: number, receiverId: number) {
    const existingRequest = await this.prisma.friendrequest.findFirst({
      where: { sender_id: senderId, receiver_id: receiverId, status: 'pending' },
    });

    if (existingRequest) throw new Error('Friend request already sent');

    const request = await this.prisma.friendrequest.create({
      data: { sender_id: senderId, receiver_id: receiverId },
    });

    // 🔔 Notify receiver
    const sender = await this.prisma.users.findUnique({ where: { id: senderId } });
    const receiver = await this.prisma.users.findUnique({ where: { id: receiverId } });

    if (receiver?.fcmToken) {
      await this.sendNotification(
        receiver.fcmToken,
        'New Friend Request',
        `${sender?.displayName || 'Someone'} sent you a friend request`
      );
    }

    return request;
  }

  // ✅ Accept Friend Request
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

    // 🔔 Notify sender
    const sender = await this.prisma.users.findUnique({ where: { id: request.sender_id } });
    const receiver = await this.prisma.users.findUnique({ where: { id: request.receiver_id } });

    if (sender?.fcmToken) {
      await this.sendNotification(
        sender.fcmToken,
        'Friend Request Accepted',
        `${receiver?.displayName || 'Your friend'} accepted your request`
      );
    }

    return { message: 'Friend request accepted' };
  }

  // ❌ Reject Friend Request
  async rejectFriendRequest(requestId: number) {
    const request = await this.prisma.friendrequest.findUnique({ where: { id: requestId } });

    if (!request) throw new Error('Friend request not found');
    if (request.status !== 'pending') throw new Error('Cannot reject a non-pending request');

    await this.prisma.friendrequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });

    // 🔔 Notify sender
    const sender = await this.prisma.users.findUnique({ where: { id: request.sender_id } });
    const receiver = await this.prisma.users.findUnique({ where: { id: request.receiver_id } });

    if (sender?.fcmToken) {
      await this.sendNotification(
        sender.fcmToken,
        'Friend Request Rejected',
        `${receiver?.displayName || 'User'} rejected your friend request`
      );
    }

    return { message: 'Friend request rejected' };
  }
}
