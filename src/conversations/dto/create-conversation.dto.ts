import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty } from 'class-validator'

export class CreateConversationDto {
    @IsNotEmpty()
    name: string
    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({ each: true })
    participants: string[]
}
