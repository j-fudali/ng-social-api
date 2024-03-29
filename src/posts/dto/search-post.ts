import {
    IsEnum,
    IsIn,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    ValidateIf,
} from 'class-validator'

export class SearchPost {
    @IsOptional()
    @IsString()
    @MinLength(1)
    search: string
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(['public', 'private', 'group'])
    visibility: string
    @IsOptional()
    @ValidateIf(({ visibility }) => visibility === 'group')
    @IsNotEmpty()
    @IsMongoId()
    groupId: string
}
