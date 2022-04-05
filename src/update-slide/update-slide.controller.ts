import { Controller, Get, Param } from '@nestjs/common';

import { UpdateSlideService } from './update-slide.service';

@Controller('update-slide')
export class UpdateSlideController {
  constructor(private readonly updateSlideService: UpdateSlideService) {}

  @Get(':id')
  async updateSlide(@Param('id') id) {
    return this.updateSlideService.updateSlide(id);
  }
}
