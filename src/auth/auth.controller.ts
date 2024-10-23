import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login-dto';
import { Response } from 'express';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { JwtService } from '@nestjs/jwt';
import { GithubAuthGuard } from './guards/github.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Get()
  getTest(): string {
    return 'hello test';
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
