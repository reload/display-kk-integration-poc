import { Module } from '@nestjs/common';
import { UpdateSlideService } from './update-slide.service';
import { UpdateSlideController } from './update-slide.controller';

@Module({
  controllers: [UpdateSlideController],
  providers: [UpdateSlideService]
})
export class UpdateSlideModule {}
