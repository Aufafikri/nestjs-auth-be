import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetProfileUserInterceptor } from './interceptors/getPorifleUser.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getAllUsers() {
    return this.usersService.getAllUsers();
  }
  
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(GetProfileUserInterceptor)
  public async getUserById(@Request() req: any) {
    return await this.usersService.getOneUserById(req.user.id)
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
    console.log('Register route hit');
    try {
      const result = await this.usersService.createUser(user);
      console.log('User creation successful');
      return result;
    } catch (error) {
      console.error('Error during user creation:', error);
      throw error;
    }
  }
}
