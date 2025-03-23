import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.schema';
import * as validator from 'validator';

// ✅ إنشاء DTO للتحقق من البيانات
class RegisterUserDto {
  email: string;
  password: string;
  linkedInUrl: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const { email, password, linkedInUrl } = body;

    // ✅ التحقق من صحة البريد الإلكتروني
    if (!email || !validator.isEmail(email)) {
      throw new BadRequestException('❌ Invalid email format!');
    }

    // ✅ التأكد من إدخال كلمة المرور
    if (!password || password.length < 6) {
      throw new BadRequestException(
        '❌ Password must be at least 6 characters long!',
      );
    }

    // ✅ التحقق من صحة رابط LinkedIn
    if (
      !linkedInUrl ||
      !validator.isURL(linkedInUrl, {
        protocols: ['http', 'https'],
        require_protocol: true,
      })
    ) {
      throw new BadRequestException('❌ Invalid LinkedIn URL!');
    }

    console.log('📝 Registering user:', email);

    return this.usersService.createUser(email, password, linkedInUrl);
  }

  @Get(':email')
  async getUser(@Param('email') email: string): Promise<User | null> {
    if (!validator.isEmail(email)) {
      throw new BadRequestException('❌ Invalid email format!');
    }

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('❌ User not found!');
    }

    return user;
  }
}
