import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ProgressService } from '../progress/progress.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private onlineUsers = new Map<string, string>(); // userId -> socket.id

  constructor(private chatService: ChatService, private progressService: ProgressService) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} connected`);
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = [...this.onlineUsers.entries()]
      .find(([_, id]) => id === socket.id)?.[0];

    if (userId) {
      this.onlineUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { senderId: string; receiverId: string; content: string }) {
    const message = await this.chatService.saveMessage(
      payload.senderId,
      payload.receiverId,
      payload.content,
    ); 
    try{
      await this.progressService.updateProgress(payload.senderId, { messagesSent: 1 });
    } 
    catch(error){
      console.error('Failed to update message progress:',error.message);
    }

    // Emit to sender
    client.emit('newMessage', message);

    // Emit to receiver if online
    const receiverSocketId = this.onlineUsers.get(payload.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', message);
    }
  }
}
