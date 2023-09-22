import { IsIn, IsNotEmpty } from 'class-validator'

export class UpdateReactionDto {
    @IsNotEmpty()
    @IsIn(['like', 'dislike'])
    reaction: string
}
