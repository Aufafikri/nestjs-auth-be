import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-github2'
import { PrismaService } from "src/lib/prisma.service";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private readonly prisma: PrismaService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            scope: ['user:email']
        })
    }

    public async validate(accessToken: string, refreshToken: string, profile: any) {
        const { id, username, emails } = profile

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
    }
}