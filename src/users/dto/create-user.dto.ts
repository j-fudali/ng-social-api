import {
    IsEmail,
    IsNotEmpty,
    IsNumberString,
    IsPhoneNumber,
    Length,
    MaxLength,
} from 'class-validator'

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
}
