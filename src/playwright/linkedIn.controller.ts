import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { PlaywrightService } from './linkedIn.service';

@Controller('playwright')
export class PlaywrightController {
  constructor(private readonly playwrightService: PlaywrightService) {}

  @Get('linkedin')
  async getLinkedInData(
    @Query('url') url: string,
    @Query('email') email: string,
    @Query('password') password: string,
  ) {
    if (!url || !email || !password) {
      throw new BadRequestException(
        '❌ URL, email, and password are required for scraping LinkedIn.',
      );
    }

    return this.playwrightService.scrapeLinkedIn(url, email, password);
  }
}
