import { Controller, Get, Param } from '@nestjs/common';
import { ButterflyCustomizationsService } from './butterfly-customizations.service';

@Controller('butterfly-customizations')
export class ButterflyCustomizationsController {
  constructor(
    private readonly butterflyCustomizationsService: ButterflyCustomizationsService,
  ) {}

  @Get()
  findAll() {
    return this.butterflyCustomizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.butterflyCustomizationsService.findOne(id);
  }
}
