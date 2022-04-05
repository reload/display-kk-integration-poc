import { Controller, Get, Param } from '@nestjs/common';
import { RemoveSlideService } from './remove-slide.service';

@Controller('remove-slide')
export class RemoveSlideController {
  constructor(private readonly removeSlideService: RemoveSlideService) {}

  @Get(':id')
  async deleteSlide(@Param('id') id) {
    return this.removeSlideService.deleteSlide(id);
  }
}
