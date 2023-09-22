import { IsIn, IsNotEmpty } from 'class-validator'

export class CreateReactionDto {
    @IsNotEmpty()
    @IsIn(['like', 'dislike'])
    reaction: string
}
