import { IsMongoId, IsNotEmpty } from 'class-validator'

export class sendInvitationDto {
    @IsNotEmpty()
    @IsMongoId()
    invitedUserId: string
}
