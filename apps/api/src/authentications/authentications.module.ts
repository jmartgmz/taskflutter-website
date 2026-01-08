import { Module } from '@nestjs/common';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AuthenticationsController],
  providers: [AuthenticationsService, PrismaService],
})
export class AuthenticationsModule {}
