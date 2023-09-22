import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator'

export class GetRelatedReactions {
    @IsNotEmpty()
    @IsMongoId()
    relatedPlaceId: string
    @IsNotEmpty()
    @IsEnum(['Post', 'Comment'])
    relatedTo: string
}
