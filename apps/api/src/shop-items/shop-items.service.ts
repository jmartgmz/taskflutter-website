import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShopItemsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.shopItem.findMany({
      where: {
        userId,
      },
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

  async purchase(userId: string, shopItemId: string) {
    // Get the shop item and verify it belongs to the user
    const shopItem = await this.prisma.shopItem.findFirst({
      where: {
        id: shopItemId,
        userId,
      },
    });

    if (!shopItem) {
      throw new Error('Shop item not found or access denied');
    }

    if (shopItem.isOwned) {
      throw new Error('Item is already owned');
    }

    // Get the user to check points
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.userPoints < shopItem.itemCost) {
      throw new Error('Insufficient points');
    }

    // Deduct points and mark item as owned
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          userPoints: {
            decrement: shopItem.itemCost,
          },
        },
      }),
      this.prisma.shopItem.update({
        where: { id: shopItemId },
        data: {
          isOwned: true,
        },
      }),
    ]);

    // Return updated shop item
    return this.prisma.shopItem.findUnique({
      where: { id: shopItemId },
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
    return this.prisma.shopItem.findUnique({
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

  async create(
    userId: string,
    itemData: {
      itemName: string;
      itemType: string;
      itemColor: string;
      itemCost: number;
      itemDescription?: string;
    },
  ) {
    return this.prisma.shopItem.create({
      data: {
        userId,
        itemName: itemData.itemName,
        itemType: itemData.itemType,
        itemColor: itemData.itemColor,
        itemCost: itemData.itemCost,
        itemDescription: itemData.itemDescription || null,
        isOwned: false, // New items start as not owned
      },
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

  async delete(userId: string, shopItemId: string) {
    // Verify the shop item belongs to the user
    const shopItem = await this.prisma.shopItem.findFirst({
      where: {
        id: shopItemId,
        userId,
      },
    });

    if (!shopItem) {
      throw new Error('Shop item not found or access denied');
    }

    // Delete the shop item
    await this.prisma.shopItem.delete({
      where: { id: shopItemId },
    });

    return { success: true };
  }
}
