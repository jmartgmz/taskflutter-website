import { Module } from '@nestjs/common';
import { ShopItemsController } from './shop-items.controller';
import { ShopItemsService } from './shop-items.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ShopItemsController],
  providers: [ShopItemsService, PrismaService],
})
export class ShopItemsModule {}
