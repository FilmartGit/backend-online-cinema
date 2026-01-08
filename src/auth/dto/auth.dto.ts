import { IsEmail, IsString } from 'class-validator'

export class AuthDto {
    @IsString({
        message: 'Имя должно быть строкой'
    })
    name: string
    @IsEmail()
    email: string
    @IsString()
    password: string
}