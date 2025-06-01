import { Controller, Post, Patch, Body, Param, ParseIntPipe, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { FriendRequestsService } from './friendRequest.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('friend-requests')
@UseGuards(JwtAuthGuard)
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}


  @Post('send')
  async sendFriendRequest(@Body('senderId') senderId: string, @Body('receiverId') receiverId: string
  ){
    console.log('📥 Friend request incoming...');
    console.log('senderId:', senderId);
    console.log('receiverId:', receiverId);
  
    if (!senderId || !receiverId) {
      throw new Error('Missing senderId or receiverId');
    }
  
    return this.friendRequestsService.sendFriendRequest(senderId, receiverId);
  }

  @Get('pending')  
  async getPendingRequests(@Req() req: Request & { user?: { user_id: string } }) {
  const userId = req.user?.user_id; 
  return this.friendRequestsService.getPendingRequests(userId);
  }
  
  @Patch('accept/:requestId')
  async acceptFriendRequest(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.friendRequestsService.acceptFriendRequest(requestId);
  } 

  @Patch('reject/:requestId')
  async rejectFriendRequest(@Param('requestId', ParseIntPipe) requestId: number) {
  return this.friendRequestsService.rejectFriendRequest(requestId);
  }

  @Get('friends')
  async getFriendsList(@Req() req: Request & { user?: { user_id: string } }) {
    const userId = req.user?.user_id; // Get the user_id from JWT token
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.friendRequestsService.getFriendsList(userId);
  }
}

