import { IsMongoId, IsNotEmpty } from 'class-validator'

export class AcceptFriendshipDto {
    @IsNotEmpty()
    @IsMongoId()
    requester: string
}

