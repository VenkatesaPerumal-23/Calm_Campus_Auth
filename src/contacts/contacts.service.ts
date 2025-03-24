import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  // Add Contact (Friend or Professional)
  async addContact(userId: number, contactId: number, type: 'friend' | 'professional') {
    if (type === 'friend') {
      const isFriend = await this.prisma.friend.findFirst({
        where: {user_id:userId, friend_id: contactId },
      });

      if (isFriend) throw new Error('Already friends');

      return this.prisma.friend.create({ data: { user_id:userId, friend_id: contactId } });
    } else {
      const isProfessional = await this.prisma.professional.findFirst({
        where: { user_id:userId, professional_id: contactId },
      });

      if (isProfessional) throw new Error('Already a professional contact');

      return this.prisma.professional.create({ data: { user_id:userId, professional_id: contactId } });
    }
  }

  // Retrieve User Contacts (Friends & Professionals)
  async getUserContacts(userId: number) {
    const friends = await this.prisma.friend.findMany({
      where: { user_id:userId },
      include: { users_friend_friend_idTousers: true},
    });

    const professionals = await this.prisma.professional.findMany({
      where: { user_id:userId },
      include: {users_professional_professional_idTousers: true  },
    });

    return {
      friends: friends.map(f => ({
        id: f.users_friend_friend_idTousers.id,
        name: f.users_friend_friend_idTousers.displayName,
        email: f.users_friend_friend_idTousers.email,
      })),
      professionals: professionals.map(p => ({
        id: p.users_professional_professional_idTousers.id,
        name: p.users_professional_professional_idTousers.displayName,
        email: p.users_professional_professional_idTousers.email,
      })),
    };
  }
}
