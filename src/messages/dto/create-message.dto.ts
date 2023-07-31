import { IsMongoId, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateMessageDto {
    @IsNotEmpty()
    @MaxLength(2000)
    text: string
    @IsNotEmpty()
    @IsMongoId()
    conversation: string
}
