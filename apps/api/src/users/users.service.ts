import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            completedAt: true,
          },
        },
        authentications: {
          select: {
            id: true,
            provider: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            completedAt: true,
            dueDate: true,
          },
        },
        authentications: {
          select: {
            id: true,
            provider: true,
          },
        },
      },
    });
  }

  async update(id: string, data: { firstName?: string; lastName?: string }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  }
}
