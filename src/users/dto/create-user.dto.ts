import { Transform, Type } from 'class-transformer'
import {
    IsBoolean,
    IsDate,
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
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
    @Type(() => Date)
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
