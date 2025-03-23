import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    if (!email || !pass) {
      throw new UnauthorizedException('البريد الإلكتروني وكلمة المرور مطلوبان');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    const { password, ...userWithoutPassword } = user; // ✅ إزالة كلمة المرور فقط
    return userWithoutPassword;
  }

  async login(user: any) {
    if (!user || !user._id) {
      throw new UnauthorizedException('بيانات المستخدم غير صحيحة');
    }

    const payload = { email: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name || null,
        linkedinProfile: user.linkedinProfile || null, // ✅ تأكد من استرجاعه
        profilePicture: user.profilePicture || null, // ✅ تأكد من استرجاعه
      },
    };
  }
}
