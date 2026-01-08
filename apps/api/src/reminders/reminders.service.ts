import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reminder.findMany({
      include: {
        task: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.reminder.findUnique({
      where: { id },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            userId: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }
}
