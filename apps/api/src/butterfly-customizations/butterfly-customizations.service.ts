import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ButterflyCustomizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.butterflyCustomization.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.butterflyCustomization.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            userPoints: true,
          },
        },
      },
    });
  }
}
