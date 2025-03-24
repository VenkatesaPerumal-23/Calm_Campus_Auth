import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  // Define target values for progress metrics
  private TARGETS = {
    newConnections: 30,
    articlesRead: 15,
    messagesSent: 500,
    hoursSlept: 0,  // Optional user input
    booksRead: 0     // Optional user input
  };

  // Normalize metric values to a 0-100 scale
  private calculateScore(actual: number, target: number): number {
    return Math.min((actual / target) * 100, 100);
  }

  // Get user progress with calculated scores
  async getProgress(userId: number) {
    const progress = await this.prisma.progress.findFirst({
      where: { userId },
    });

    if (!progress) {
      return { message: 'No progress data found for this user.' };
    }

    // Normalize scores
    const scores = {
      newConnections: this.calculateScore(progress.newConnections, this.TARGETS.newConnections),
      articlesRead: this.calculateScore(progress.articlesRead, this.TARGETS.articlesRead),
      messagesSent: this.calculateScore(progress.messagesSent, this.TARGETS.messagesSent),
      hoursSlept: progress.hoursSlept !== null ? this.calculateScore(progress.hoursSlept, this.TARGETS.hoursSlept) : null,
      booksRead: progress.booksRead !== null ? this.calculateScore(progress.booksRead, this.TARGETS.booksRead) : null
    };

    // Overall progress: Average of available metrics
    const values = Object.values(scores).filter((v) => v !== null) as number[];
    const overallProgress = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

    return { ...progress, scores, overallProgress };
  }

  // Update progress
  async updateProgress(
    userId: number,
    data: Partial<{ newConnections: number; articlesRead: number; messagesSent: number; hoursSlept?: number; booksRead?: number }>
  ) {
    try {
      // Get existing progress data
      const existingProgress = await this.prisma.progress.findUnique({
        where: { id:userId },
      });
  
      if (!existingProgress) {
        throw new Error('Progress record not found for this user.');
      }
  
      // Prepare update object (increment values if provided)
      const updateData: any = {};
      if (data.newConnections !== undefined) {
        updateData.newConnections = { increment: Number(data.newConnections) };
      }
      if (data.articlesRead !== undefined) {
        updateData.articlesRead = { increment: Number(data.articlesRead) };
      }
      if (data.messagesSent !== undefined) {
        updateData.messagesSent = { increment: Number(data.messagesSent) };
      }
      if (data.hoursSlept !== undefined) {
        updateData.hoursSlept = { increment: Number(data.hoursSlept) };
      }
      if (data.booksRead !== undefined) {
        updateData.booksRead = { increment: Number(data.booksRead) };
      }
  
      // Update progress in database
      return this.prisma.progress.update({
        where: { id:userId },
        data: updateData,
      });
    } catch (error) {
      throw new Error('Update failed: ' + error.message);
    }  
}
}