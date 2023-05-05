import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator'

export class GetRelatedReactions {
    @IsNotEmpty()
    @IsMongoId()
    relatedPlaceId: string
    @IsNotEmpty()
    @IsEnum({ Post: 'Post', Comment: 'Comment' })
    relatedTo: string
}
