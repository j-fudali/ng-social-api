import {
    IsArray,
    IsIn,
    IsMongoId,
    IsNotEmpty,
    IsString,
    MaxLength,
    ValidateIf,
} from 'class-validator'
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
    @IsNotEmpty()
    @IsString()
    @IsIn(['public', 'private', 'group'])
    membership: string
    @ValidateIf((o) => o.membership === 'group')
    @IsNotEmpty()
    @IsMongoId()
    group: string
}
