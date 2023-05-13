import { IsMongoId, IsNotEmpty } from 'class-validator'

export class GetCommentsRelatedToPostDto {
    @IsNotEmpty()
    @IsMongoId()
    postId: string
}
