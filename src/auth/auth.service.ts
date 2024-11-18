import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/Login-dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/lib/prisma.service';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.getOneUserEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    await this.prisma.refreshToken.create({
      data: {
        token: refresh_token,
        userId: user.id,
        expiresAt: moment().add(7, 'days').toDate(),
      },
    });

    return {
      access_token,
      refresh_token,
    };
  }

  public async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const { sub: userId } = decoded;

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: {
          token: refreshToken,
        },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const payload = { sub: userId };
      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTNuOGozdjEwMDAwYWhmYzZvajYxNHhwIiwiZW1haWwiOiJhdWZhYWxmaWtyaTIwNjRAZ21haWwuY29tIiwiaWF0IjoxNzMxOTQ3Njk5LCJleHAiOjE3MzE5NTEyOTl9.DmTaiNMtQ_Sgu7XfHtgK2sV7bTyJp5-of8l9gQyYCNc