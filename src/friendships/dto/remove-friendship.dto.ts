import { IsMongoId, IsNotEmpty } from 'class-validator'

export class RemoveFriendshipDto {
    @IsNotEmpty()
    @IsMongoId()
    secondUser: string
}
