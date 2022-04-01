import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RemoveSlideModule } from './remove-slide/remove-slide.module';
import { UpdateSlideModule } from './update-slide/update-slide.module';

@Module({
  imports: [RemoveSlideModule, UpdateSlideModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
