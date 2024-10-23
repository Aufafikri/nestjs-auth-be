import { IsEmail, IsString } from "class-validator";

export class GoogleUsersDto {
    @IsString()
    googleId: string

    @IsEmail()
    email: string

    @IsString()
    username: string
}