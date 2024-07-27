import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  public async getUserById(@Request() req) {
    const userProfile = await this.usersService.getOneUserById(req.user.id);
    return userProfile;
  }

  @Get('/:id')
  public async FindOneById(@Param('id') id: string) {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.usersService.getOneUserById(id);
  }

  @Get('/register/:email')
  public async getOneEmailUser(@Param('email') email: string) {
    return this.usersService.getOneUserEmail(email);
  }

  @Post('/register')
  public async register(@Body() user: CreateUsersDto) {
    return this.usersService.createUser(user);
  }
}
