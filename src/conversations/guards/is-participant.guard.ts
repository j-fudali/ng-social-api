import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Conversation } from 'src/common/schemas/conversation.schema'

@Injectable()
export class IsParticipantGuard implements CanActivate {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<Conversation>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const userId = request.user.userId
        const conversationId = request.params.id || request.body.conversation
        try {
            const conversation = await this.conversationModel.findById(
                conversationId,
            )
            const isParticipated =
                conversation.creator.toString() === userId ||
                conversation.participants.includes(userId)
                    ? true
                    : false
            if (isParticipated) {
                request.conversation = conversation
            }
            return isParticipated
        } catch {
            throw new NotFoundException('Conversation not found')
        }
    }
}
