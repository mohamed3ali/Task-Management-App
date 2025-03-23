import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './user.service';
import { User, UserSchema } from './user.schema';
import { UsersController } from './user.controller';
import { PlaywrightService } from 'src/playwright/linkedIn.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, PlaywrightService],
  controllers: [UsersController],
  exports: [UsersService], 
})
export class UsersModule {}
