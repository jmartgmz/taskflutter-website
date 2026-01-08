import { Controller, Get, Param } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';

@Controller('authentications')
export class AuthenticationsController {
  constructor(
    private readonly authenticationsService: AuthenticationsService,
  ) {}

  @Get()
  findAll() {
    return this.authenticationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authenticationsService.findOne(id);
  }
}
