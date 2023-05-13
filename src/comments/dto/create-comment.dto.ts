import { IsMongoId, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateCommentDto {
    @IsNotEmpty()
    @MaxLength(1000)
    text: string
    @IsNotEmpty()
    @IsMongoId()
    post: string
}

