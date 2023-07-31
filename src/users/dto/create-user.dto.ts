import { IsBoolean, IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty()
    username: string
    @IsNotEmpty()
    firstname: string
    @IsNotEmpty()
    lastname: string
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsNotEmpty()
    birthdate: Date
    @IsNotEmpty()
    password: string
    @IsNotEmpty()
    @IsPhoneNumber('PL')
    phone: string
    @IsNotEmpty()
    @IsBoolean()
    isVisible: boolean
}
