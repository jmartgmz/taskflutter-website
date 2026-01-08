import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtUser } from '../auth/jwt.strategy';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    console.log('User accessed tasks:', user);
    return this.tasksService.findAll(user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    console.log('User accessed task:', user);
    return this.tasksService.findOne(id, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @CurrentUser() user: JwtUser,
    @Body()
    taskData: {
      title: string;
      description?: string;
      dueDate?: string;
      size?: string;
      priority?: string;
    },
  ) {
    console.log('User creating task:', user);
    return this.tasksService.create(user.userId, taskData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body()
    taskData: {
      title?: string;
      description?: string;
      dueDate?: string;
      completedAt?: string | null;
    },
  ) {
    console.log('User updating task:', user);
    return this.tasksService.update(id, user.userId, taskData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    console.log('User deleting task:', user);
    return this.tasksService.delete(id, user.userId);
  }
}
