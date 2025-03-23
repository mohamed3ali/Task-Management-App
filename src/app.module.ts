import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/task.module';
import { UsersModule } from './user/user.module';
import { PlaywrightModule } from './playwright/linkedIn.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/taskmanager'),
    AuthModule,
    UsersModule,
    TasksModule,
    PlaywrightModule,
  ],
})
export class AppModule {}
