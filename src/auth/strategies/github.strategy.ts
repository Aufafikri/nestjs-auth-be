import { ConflictException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-github2'
import { PrismaService } from "src/lib/prisma.service";
import githubOauthConfig from "../config/github-oauth.config";
import { ConfigType } from "@nestjs/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private readonly prisma: PrismaService, 
        @Inject(githubOauthConfig.KEY) private readonly githubConfiguration: ConfigType<typeof githubOauthConfig> ) {
        super({
            clientID: githubConfiguration.clientID,
            clientSecret: githubConfiguration.clientSecret,
            callbackURL: githubConfiguration.callbackURL,
            scope: ['user:email']
        })
    }

    public async validate(accessToken: string, refreshToken: string, profile: any) {
        const { id, username, emails } = profile

        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    githubId: id
                }
            })
    
            if(existingUser) {
                return {
                    user: existingUser,
                    accessToken
                }
            } else {
                const newUser = await this.prisma.user.create({
                    data: {
                        githubId: id,
                        email: emails[0].value,
                        isVerified: true,
                        username,
                        loginMethod: 'GITHUB'
                    }
                })
    
                return {
                    user: newUser,
                    accessToken
                }
            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException(
                        'Email already exists. Please sign in instead.',
                    );
                }
              } else {
                throw new InternalServerErrorException('An unexpected error occurred.');
              }
        }
    }
}