import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/lib/prisma.service';
import googleOauthConfig from '../config/google-oauth.config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleOauthConfig>,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName } = profile;

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          googleId: id,
        },
      });

      if (existingUser) {
        const payload = {
          user: existingUser,
          accessToken,
        };

        return done(null, payload);
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            googleId: id,
            email: emails[0].value,
            username: displayName,
            isVerified: true,
            loginMethod: 'GOOGLE',
          },
        });

        const payload = {
          user: newUser,
          accessToken,
        };

        done(null, payload);
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          done(
            new ConflictException(
              'Email already exists. Please sign in instead.',
            ),
            false,
          );
        }
      } else {
        done(
          new InternalServerErrorException('An unexpected error occurred.'),
          false,
        );
      }
    }
  }
}
