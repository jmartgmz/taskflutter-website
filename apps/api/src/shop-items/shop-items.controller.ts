import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ShopItemsService } from './shop-items.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtUser } from '../auth/jwt.strategy';

@Controller('shop-items')
export class ShopItemsController {
  constructor(private readonly shopItemsService: ShopItemsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.shopItemsService.findAll(user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopItemsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Body()
    itemData: {
      itemName: string;
      itemType: string;
      itemColor: string;
      itemCost: number;
      itemDescription?: string;
    },
  ) {
    return this.shopItemsService.create(user.userId, itemData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/purchase')
  purchase(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.shopItemsService.purchase(user.userId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.shopItemsService.delete(user.userId, id);
  }
}
