import {
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
}
