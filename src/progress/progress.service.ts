import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  // Define target values for progress metrics
  private TARGETS = {
    newConnections: 15,
    articlesRead: 15,
    messagesSent: 200,
  };

  // Normalize metric values to a 0-100 scale
  private calculateScore(actual: number, target: number): number {
    return Math.min((actual / target) * 100, 100);
  }

  // Get user progress with calculated scores
  async getProgress(userId: string) {
    const progress = await this.prisma.progress.findFirst({
      where: { user_id:userId },
    });

    if (!progress) {
      return { message: 'No progress data found for this user.' };
    }

    // Normalize scores
    const scores = {
      newConnections: this.calculateScore(progress.new_connections, this.TARGETS.newConnections),
      articlesRead: this.calculateScore(progress.articles_read, this.TARGETS.articlesRead),
      messagesSent: this.calculateScore(progress.messages_sent, this.TARGETS.messagesSent)
    };

    // Overall progress: Average of available metrics
    const values = Object.values(scores).filter((v) => v !== null) as number[];
    const overallProgress = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

    return { ...progress, scores, overallProgress };
  }

  // Update progress
  async updateProgress(
    userId: string,
    data: Partial<{ newConnections: number; articlesRead: number; messagesSent: number; hoursSlept?: number; booksRead?: number }>
  ) {
    try {
      // Get existing progress data
      let existingProgress = await this.prisma.progress.findFirst({
        where: { user_id:userId },
      });
  
    if (!existingProgress) {
      existingProgress = await this.prisma.progress.create({
        data: {
          user_id: userId,
          new_connections: 0,
          articles_read: 0,
          messages_sent: 0,
          hours_slept: 0,
          books_read: 0,
        },
      });
    }
  
      // Prepare update object (increment values if provided)
      const updateData: any = {};
      if (data.newConnections !== undefined) {
        updateData.new_connections = { increment: Number(data.newConnections) };
      }
      if (data.articlesRead !== undefined) {
        updateData.articles_read = { increment: Number(data.articlesRead) };
      }
      if (data.messagesSent !== undefined) {
        updateData.messages_sent = { increment: Number(data.messagesSent) };
      }
      // Update progress in database
      return this.prisma.progress.update({
        where: { user_id:userId },
        data: updateData,
      });
    } catch (error) {
      throw new Error('Update failed: ' + error.message);
    }  
  }
}