import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CreateUsersDto } from './dto/create-users.dto';
import * as bcrypt from 'bcryptjs';
import { MailsService } from 'src/mails/mails.service';
import { GoogleUsersDto } from './dto/google-users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailsService: MailsService,
  ) {}

  public async getAllUsers() {
    return this.prisma.user.findMany({});
  }

  public async createUser(dataUsersDto: CreateUsersDto) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(dataUsersDto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        ...dataUsersDto,
        password: hashedPassword,
        isVerified: false,
      },
    });

    await this.mailsService.sendVerificationEmail(user.email, user.id);

    return {
      message:
        'Registration successful. Please check your email for verification.',
    };
  }

  public async createUserWithGoogle(googleUserDto: GoogleUsersDto) {
    return this.prisma.user.create({
      data: {
        googleId: googleUserDto.googleId,
        email: googleUserDto.email,
        username: googleUserDto.username,
        isVerified: true
      }
    })
  }

  public async getOneUserEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  public async getOneUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}
