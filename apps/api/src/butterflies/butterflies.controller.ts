import { Controller, Get, Param } from '@nestjs/common';
import { ButterfliesService } from './butterflies.service';

@Controller('butterflies')
export class ButterfliesController {
  constructor(private readonly butterfliesService: ButterfliesService) {}

  @Get()
  findAll() {
    return this.butterfliesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.butterfliesService.findOne(id);
  }
}
