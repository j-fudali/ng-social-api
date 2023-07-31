import { IsMongoId, IsNotEmpty } from 'class-validator'

export class FindAllInConversation {
    @IsNotEmpty()
    @IsMongoId()
    conversationId: string
}
