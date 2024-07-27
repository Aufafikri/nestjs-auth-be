import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { CreateUsersDto } from './dto/create-users.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    public async getAllUsers() {
        return this.prisma.user.findMany({})
    }

    public async createUser(dataUsersDto: CreateUsersDto) {
        const salt = 10
        const hashedPassword = await bcrypt.hash(dataUsersDto.password, salt)

        const user = await this.prisma.user.create({
            data: {
                ...dataUsersDto,
                password: hashedPassword
            }
        })

        return user
    }

    public async getOneUserEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email: email
            }
        })
    }

    public async getOneUserById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id: id
            }
        })
    }
}
