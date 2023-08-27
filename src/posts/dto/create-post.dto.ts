import {
    IsArray,
    IsEnum,
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
    visibility: string
    @ValidateIf((o) => o.visibility === 'group')
    @IsNotEmpty()
    @IsMongoId()
    group: string
}
