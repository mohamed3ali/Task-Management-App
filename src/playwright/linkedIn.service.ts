import { Injectable, Logger } from '@nestjs/common';
import { chromium, Browser, Page } from 'playwright';

@Injectable()
export class PlaywrightService {
  private readonly logger = new Logger(PlaywrightService.name);

  async scrapeLinkedIn(linkedinUrl: string, email: string, password: string) {
    let browser: Browser | null = null;
    let page: Page;

    try {
      this.logger.log('🚀 Launching Playwright...');

      browser = await chromium.launch({
        headless: false,
        slowMo: 150,
      });

      page = await browser.newPage();
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.setExtraHTTPHeaders({
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      });

      this.logger.log('🔑 Logging into LinkedIn...');
      await page.goto('https://www.linkedin.com/login', {
        waitUntil: 'networkidle',
        timeout: 120000,
      });

      if (!email || !password) {
        throw new Error('❌ LinkedIn credentials are required');
      }

      await page.fill('#username', email);
      await page.fill('#password', password);
      await page.click('button[type="submit"]');

      await page.waitForNavigation({
        waitUntil: 'networkidle',
        timeout: 120000,
      });

      if (page.url().includes('checkpoint')) {
        throw new Error(
          '⚠️ LinkedIn is asking for verification, manual login required!',
        );
      }

      this.logger.log(`🔗 Navigating to LinkedIn Profile: ${linkedinUrl}`);
      await page.goto(linkedinUrl, {
        waitUntil: 'networkidle',
        timeout: 120000,
      });

      await page.waitForTimeout(3000);

      const name = await page.evaluate(() => {
        const el = document.querySelector(
          'h1.KPDFNYxtsToFahejNuWcrXVMBhNcOkIObM',
        );
        return el ? el.textContent?.trim() || '❌ Name not found' : null;
      });

      const profilePicture = await page.evaluate(() => {
        const imgEl = document.querySelector(
          '.pv-top-card-profile-picture__image, .pv-top-card-profile-picture__image--show',
        );
        return imgEl ? imgEl.getAttribute('src') : null;
      });

      if (!name) {
        this.logger.warn('❌ Could not scrape name.');
      }

      if (!profilePicture) {
        this.logger.warn('❌ Could not scrape profile picture.');
      }

      this.logger.log(
        `✅ Scraped Data: Name: ${name}, Profile Picture: ${profilePicture}`,
      );

      return { name, profilePicture };
    } catch (error) {
      this.logger.error('❌ Error scraping LinkedIn:', error);
      throw new Error(`Failed to scrape LinkedIn: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
        this.logger.log('🛑 Playwright closed.');
      }
    }
  }
}
