import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as admin from 'firebase-admin'; 
import { ProgressService } from '../progress/progress.service';


@Injectable()
export class FriendRequestsService {
  constructor(private prisma: PrismaService, private progressService: ProgressService) {}

  // 🔔 Utility function to send FCM notification
  private async sendNotification(fcmToken: string, title: string, body: string) {
    if (!fcmToken) return;

    const message = {
      notification: { title, body },
      token: fcmToken,
    };

    try {
      await admin.messaging().send(message);
      console.log('notification sent successfully');
    } catch (err) {
      console.error('FCM send error:', err);
    }
  }

  // 📩 Send Friend Request
  async sendFriendRequest(senderId: string, receiverId: string) {
    const existingRequest = await this.prisma.friendrequest.findFirst({
      where: { sender_id: senderId, receiver_id: receiverId, status: 'pending' },
    });

    if (existingRequest) throw new Error('Friend request already sent');

    const request = await this.prisma.friendrequest.create({
      data: { sender_id: senderId, receiver_id: receiverId },
    });

    // 🔔 Notify receiver
    const sender = await this.prisma.users.findUnique({ where: { user_id: senderId } });
    const receiver = await this.prisma.users.findUnique({ where: { user_id: receiverId } });

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

    try{
      await this.progressService.updateProgress(request.sender_id,{newConnections:1});
      await this.progressService.updateProgress(request.receiver_id,{newConnections:1});
    } 
    catch(error){
      console.error('Failed to update new connection:', error.message);
    }

    // 🔔 Notify sender
    const sender = await this.prisma.users.findUnique({ where: { user_id: request.sender_id } });
    const receiver = await this.prisma.users.findUnique({ where: { user_id: request.receiver_id } });

    if (sender?.fcmToken) {
      await this.sendNotification(
        sender.fcmToken,
        'Friend Request Accepted',
        `${receiver?.displayName || 'Your friend'} accepted your friend request`
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
    const sender = await this.prisma.users.findUnique({ where: { user_id: request.sender_id } });
    const receiver = await this.prisma.users.findUnique({ where: { user_id: request.receiver_id } });

    if (sender?.fcmToken) {
      await this.sendNotification(
        sender.fcmToken,
        'Friend Request Rejected',
        `${receiver?.displayName || 'User'} rejected your friend request`
      );
    }

    return { message: 'Friend request rejected' };
  }
//  Get all pending requests where the user is the receiver
  async getPendingRequests(userId: string) {
    return this.prisma.friendrequest.findMany({
      where: {
        receiver_id: userId,
        status: 'pending',
      },
      include: {
        users_friendrequest_sender_idTousers: {
          select: {
            user_id: true,
            displayName: true,
            photoUrl: true, 
          },
        },
      },
    });
  }

  // Get list of friends for a particular user
  async getFriendsList(userId: string) {
    const friends = await this.prisma.friend.findMany({
      where: {
        OR: [
          { user_id: userId },
          { friend_id: userId },
        ],
      },
      include: {
        users_friend_user_idTousers: {
          select: {
            user_id: true,
            displayName: true,
            photoUrl: true,
          },
        },
        users_friend_friend_idTousers: {
          select: {
            user_id: true,
            displayName: true,
            photoUrl: true,
          },
        },
      },
    });

    // Deduplicate based on friendId
    const seen = new Set();
    const uniqueFriends = [];

    for (const friend of friends) {
      const isInitiator = friend.user_id === userId;
      const friendId = isInitiator ? friend.friend_id : friend.user_id;
      const friendDetails = isInitiator
        ? friend.users_friend_friend_idTousers
        : friend.users_friend_user_idTousers;

      if (!seen.has(friendId)) {
        seen.add(friendId);
        uniqueFriends.push({
          friendId,
          displayName: friendDetails?.displayName || 'Unknown',
          photoUrl: friendDetails?.photoUrl || null,
        });
      }
    }

    return uniqueFriends;
  }
}


