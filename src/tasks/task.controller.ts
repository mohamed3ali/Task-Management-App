import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserTasks(
    @Param('userId') userId: string,
    @Query('category') category?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    return this.tasksService.getUserTasks(userId, category, sort);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTask(@Body() taskData: CreateTaskDto) {
    return this.tasksService.createTask(taskData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateTask(@Param('id') id: string, @Body() updateData: UpdateTaskDto) {
    return this.tasksService.updateTask(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
