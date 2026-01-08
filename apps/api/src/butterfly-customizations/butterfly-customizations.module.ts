import { Module } from '@nestjs/common';
import { ButterflyCustomizationsController } from './butterfly-customizations.controller';
import { ButterflyCustomizationsService } from './butterfly-customizations.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ButterflyCustomizationsController],
  providers: [ButterflyCustomizationsService, PrismaService],
})
export class ButterflyCustomizationsModule {}
