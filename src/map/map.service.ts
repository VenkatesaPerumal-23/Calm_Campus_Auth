import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MapsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get all users
  async getAllUsers() {
    return this.prisma.users.findMany({
      select: {
        user_id: true,
        displayName: true,
        country: true,
        photoUrl: true,
      },
    });
  }

  // 2. Get all users from a specific country
  async getUsersByCountry(country: string) {
    const whereClause: any = {};

    if (country) {
      whereClause.country = {
        contains: country,
      };
    }

    return this.prisma.users.findMany({
      where: whereClause,
      select: {
        user_id: true,
        displayName: true,
        country: true,
        photoUrl: true,
      },
    });
  }


  // 3. Get a user's friends from a specific country
  async getFriendsFromCountry(userId: string, country: string) {
    const targetCountry = country.trim().toLowerCase();

    // Step 1: Get all friend relationships for the user
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
            country: true,
          },
        },
        users_friend_friend_idTousers: {
          select: {
            user_id: true,
            displayName: true,
            photoUrl: true,
            country: true,
          },
        },
      },
    });

    const seen = new Set();
    const filteredFriends = [];

    for (const friend of friends) {
      const isInitiator = friend.user_id === userId;

      const otherUser = isInitiator ? friend.users_friend_friend_idTousers : friend.users_friend_user_idTousers;

      if (
        otherUser &&
        otherUser.country &&
        otherUser.country.trim().toLowerCase() === targetCountry &&
        !seen.has(otherUser.user_id)
      ) {
        seen.add(otherUser.user_id);
        filteredFriends.push({
          user_id: otherUser.user_id,
          displayName: otherUser.displayName,
          country: otherUser.country,
          photoUrl: otherUser.photoUrl,
        });
      }
    }

    console.log('Filtered Friends from country:', filteredFriends);

    return filteredFriends;
  }
}
