import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import * as validator from 'validator';

// ✅ إنشاء DTO للتحقق من بيانات تسجيل الدخول
class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    // ✅ التحقق من صحة البيانات
    if (!email || !validator.isEmail(email)) {
      throw new BadRequestException('❌ البريد الإلكتروني غير صالح!');
    }

    if (!password || password.length < 6) {
      throw new BadRequestException(
        '❌ كلمة المرور يجب أن تكون على الأقل 6 أحرف!',
      );
    }

    // ✅ التحقق من صحة بيانات المستخدم
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(
        '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة!',
      );
    }

    return this.authService.login(user);
  }

  // ✅ استخدام GET بدلاً من POST للحصول على ملف المستخدم
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name || null,
      linkedinProfile: req.user.linkedinProfile || null,
      profilePicture: req.user.profilePicture || null,
    };
  }
}
