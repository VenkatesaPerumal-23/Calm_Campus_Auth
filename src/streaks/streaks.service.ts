import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { subDays, isSameDay } from 'date-fns';

@Injectable()
export class StreaksService {
  constructor(private prisma: PrismaService) {}

  async getStreak(userId: string) {
    return this.prisma.streaks.findUnique({
      where: { user_id: userId },
    });
  }

  async trackStreak(userId: string) {
    const streak = await this.prisma.streaks.findUnique({ where: { user_id: userId } });
    const today = new Date();

    if (!streak) {
      return this.prisma.streaks.create({
        data: {
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_active_date: today,
        },
      });
    }

    const lastActive = streak.last_active_date;

    if (isSameDay(lastActive, today)) {
      return { message: 'Streak already counted for today' };
    }

    if (isSameDay(subDays(today, 1), lastActive)) {
      const updatedStreak = streak.current_streak + 1;
      return this.prisma.streaks.update({
        where: { user_id: userId },
        data: {
          current_streak: updatedStreak,
          longest_streak: Math.max(updatedStreak, streak.longest_streak),
          last_active_date: today,
        },
      });
    } else {
      return this.prisma.streaks.update({
        where: { user_id: userId },
        data: { current_streak: 1, last_active_date: today },
      });
    }
  }

  // async restoreStreak(userId: string, coinsUsed: number) {
  //   const streak = await this.prisma.streaks.findUnique({ where: { user_id: userId } });

  //   if (!streak) return { message: 'No streak found' };
  //   if (coinsUsed < 5) return { message: 'Not enough coins to restore streak' };

  //   return this.prisma.streaks.update({
  //     where: { user_id: userId },
  //     data: { last_active_date: new Date() },
  //   });
  // }
}
