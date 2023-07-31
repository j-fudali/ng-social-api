import {
    ArrayMinSize,
    IsArray,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator'

export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    participants: string[]
    @IsOptional()
    @MaxLength(500)
    description: string
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(3)
    tags: string[]
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    moderatores: string[]
}
