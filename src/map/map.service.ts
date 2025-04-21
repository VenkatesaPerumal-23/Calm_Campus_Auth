import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MapsService {
  constructor(private prisma: PrismaService) {}

  async getUserDensity() {
    return this.prisma.users.groupBy({
      by: ['country'],
      _count: { country: true },
    });
  }

  async getCountryDetails(countryCode: string) {
    const totalUsers = await this.prisma.users.count({
      where: { country: countryCode },
    });

    return { country: countryCode, totalUsers };
  }
}