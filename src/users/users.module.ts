import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService]
})

export class UsersModule {}