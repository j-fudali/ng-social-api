import { IsMongoId, IsNotEmpty, IsNotEmptyObject } from 'class-validator'

export class CreateFriendshipDto {
    @IsNotEmpty()
    @IsMongoId()
    recipient: string
}

