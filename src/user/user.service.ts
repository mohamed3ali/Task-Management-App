import { PlaywrightService } from 'src/playwright/linkedIn.service';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';
import * as playwright from 'playwright';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private playwrightService: PlaywrightService,
  ) {}

  async createUser(
    email: string,
    password: string,
    linkedinUrl: string,
  ): Promise<User> {
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let name: string | null;
    let profilePicture: string | null;

    console.log('🔍 Fetching LinkedIn Data...');
    const linkedInData = await this.playwrightService.scrapeLinkedIn(
      linkedinUrl,
      'moedali094@gmail.com',
      'Muhammadali25112000',
    );
    name = linkedInData.name!;
    profilePicture = linkedInData.profilePicture!;
    console.log('✅ Scraped LinkedIn Data:', { name, profilePicture });

    const user = new this.userModel({
      email,
      password: hashedPassword,
      name: name,
      linkedinProfile: linkedinUrl,
      profilePicture: profilePicture,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }
    return user;
  }

  async scrapeLinkedIn(linkedinUrl: string) {
    let browser;
    try {
      console.log(`🌍 Navigating to LinkedIn URL: ${linkedinUrl}`);

      browser = await playwright.chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.goto(linkedinUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      console.log('📄 Page loaded, extracting data...');

      const name = await page.evaluate(() => {
        const element = document.querySelector('.text-heading-xlarge');
        return element ? (element.textContent?.trim() ?? null) : null;
      });

      const profilePicture = await page.evaluate(() => {
        const element = document.querySelector(
          '.pv-top-card-profile-picture__image',
        );
        return element ? (element.getAttribute('src') ?? null) : null;
      });

      console.log('✅ Extracted:', { name, profilePicture });

      return { name, profilePicture };
    } catch (error) {
      console.error('❌ Playwright Error:', error);
      return { name: null, profilePicture: null };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
