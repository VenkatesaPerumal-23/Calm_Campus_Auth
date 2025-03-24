import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCountryDto } from './dto/update-country';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { displayName?: string}) {
    const { displayName} = filters;

    // If any filter is applied, return only `displayName`
    if (displayName) {
      return this.prisma.users.findMany({
        where: {
          displayName: displayName ? { contains: displayName } : undefined
        },
        select: { displayName: true }, // Return only `displayName`
      });
    }

    // If no filter is applied, return all user details
    return this.prisma.users.findMany();
  }


  async findOne(user_id:string) {
    return this.prisma.users.findUnique({ where: { user_id } });
  }

  async updateCountry(user_id: string, updateCountryDto: UpdateCountryDto) {
    const { country } = updateCountryDto;
    console.log(country);
    // Update the user's country
    const updatedUser = await this.prisma.users.update({
      where: { user_id: user_id },
      data: { country },
    });

    return updatedUser;
  }
}
