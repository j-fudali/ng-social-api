import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SearchParam {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    search: string
}
