import { Module } from '@nestjs/common';
import { PlaywrightService } from './linkedIn.service';

@Module({
  providers: [PlaywrightService],
  exports: [PlaywrightService],
})
export class PlaywrightModule {}
