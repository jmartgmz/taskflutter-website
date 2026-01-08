import { Module } from '@nestjs/common';
import { ButterfliesController } from './butterflies.controller';
import { ButterfliesService } from './butterflies.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ButterfliesController],
  providers: [ButterfliesService, PrismaService],
})
export class ButterfliesModule {}
