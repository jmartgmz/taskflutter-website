import { Module } from '@nestjs/common';

import { LinksModule } from './links/links.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ButterfliesModule } from './butterflies/butterflies.module';
import { RemindersModule } from './reminders/reminders.module';
import { ButterflyCustomizationsModule } from './butterfly-customizations/butterfly-customizations.module';
import { ShopItemsModule } from './shop-items/shop-items.module';
import { AuthenticationsModule } from './authentications/authentications.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    LinksModule,
    TasksModule,
    UsersModule,
    ButterfliesModule,
    RemindersModule,
    ButterflyCustomizationsModule,
    ShopItemsModule,
    AuthenticationsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
