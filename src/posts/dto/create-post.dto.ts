import { IsArray, IsNotEmpty, MaxLength } from 'class-validator'

export class CreatePostDto {
    @IsNotEmpty()
    @MaxLength(250)
    title: string
    @IsNotEmpty()
    @MaxLength(1000)
    text: string
    @IsNotEmpty()
    @IsArray()
    categories: string[]
}

