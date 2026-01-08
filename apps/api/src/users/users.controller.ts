import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtUser } from '../auth/jwt.strategy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@CurrentUser() auth: JwtUser) {
    console.log('Current user auth:', auth);
    if (!auth || !auth.userId) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne(auth.userId);
    if (!user) {
      throw new Error('User not found');
    }
    // Return only what your client needs (include the DB id!)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      firstName: user.firstName,
      lastName: user.lastName,
      userPoints: user.userPoints,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateMe(
    @CurrentUser() auth: JwtUser,
    @Body() updateData: { firstName?: string; lastName?: string },
  ) {
    if (!auth || !auth.userId) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.update(auth.userId, updateData);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      firstName: user.firstName,
      lastName: user.lastName,
      userPoints: user.userPoints,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
