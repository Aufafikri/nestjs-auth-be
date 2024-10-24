import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login-dto';
import { Response } from 'express';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { JwtService } from '@nestjs/jwt';
import { GithubAuthGuard } from './guards/github.auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  @Get('verify-email')
  public async VerifyEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.usersService.verifyEmail(token);
      return res.redirect(`${process.env.REDIRECT_EMAIL_VERIFICATION}`);
    } catch (error) {
      return res.status(400).send('Invalid or expired token');
    }
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  public async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  public async googleLoginRedirect(@Req() req, @Res() res: Response) {
      const user = req.user.user
      const accessToken = this.jwtService.sign({ sub: user.id, email: user.email })
      
      res.redirect(`http://localhost:3000/verification/google-callback?token=${accessToken}`)
  }

  @Get('github/login')
  @UseGuards(GithubAuthGuard)
  public async githubLogin() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  public async githubLoginRedirect(@Req() req, @Res() res: Response ) {
    const user = req.user.user
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email })

    res.redirect(`http://localhost:3000/verification/github-callback?token=${accessToken}`)
  }

  @Post('/login')
  public async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
