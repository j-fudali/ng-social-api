import { IsEnum, IsNotEmpty } from 'class-validator'

export class CreateReactionDto {
    @IsNotEmpty()
    @IsEnum({ like: 'like', dislike: 'dislike' })
    reaction: string
    @IsNotEmpty()
    reactionPlaceId: string
    @IsNotEmpty()
    @IsEnum({ Post: 'Post', Comment: 'Comment' })
    reactionFor: string
}

