import { IsMongoId, IsNotEmpty } from 'class-validator'

export class CreateFriendshipDto {
    @IsNotEmpty()
    @IsMongoId()
    recipient: string
}
