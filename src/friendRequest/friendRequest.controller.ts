import { Controller, Post, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FriendRequestsService } from './friendRequest.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('friend-requests')
@UseGuards(JwtAuthGuard)
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Post('send')
  async sendFriendRequest(@Body() body: { senderId: number; receiverId: number }) {
    return this.friendRequestsService.sendFriendRequest(body.senderId, body.receiverId);
  }

  @Patch('accept/:requestId')
  async acceptFriendRequest(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.friendRequestsService.acceptFriendRequest(requestId);
  } 

  @Patch('reject/:requestId')
  async rejectFriendRequest(@Param('requestId', ParseIntPipe) requestId: number) {
  return this.friendRequestsService.rejectFriendRequest(requestId);
  }
}
