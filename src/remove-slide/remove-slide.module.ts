import { Module } from '@nestjs/common';
import { RemoveSlideService } from './remove-slide.service';
import { RemoveSlideController } from './remove-slide.controller';

@Module({
  controllers: [RemoveSlideController],
  providers: [RemoveSlideService]
})
export class RemoveSlideModule {}
