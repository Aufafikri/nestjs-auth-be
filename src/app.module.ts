import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './lib/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy'
import { MailsModule } from './mails/mails.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { GithubStrategy } from './auth/strategies/github.strategy';
import googleOauthConfig from './auth/config/google-oauth.config';
import githubOauthConfig from './auth/config/github-oauth.config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN
      },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [googleOauthConfig, githubOauthConfig]
    }),

    UsersModule, PrismaModule, AuthModule, MailsModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, GoogleStrategy, GithubStrategy],
  exports: [JwtModule]
})

export class AppModule {}
