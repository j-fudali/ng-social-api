import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Conversation } from 'src/common/schemas/conversation.schema'

@Injectable()
export class IsUserConversationAuthorGuard implements CanActivate {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<Conversation>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const paramId = request.params.id
        const userId = request.user.userId
        try {
            const req = await this.conversationModel.findById(paramId)
            if (!req) throw new NotFoundException('Comment not found')
            return req.creator.toString() === userId ? true : false
        } catch (error) {
            throw new BadRequestException('Invalid data provided')
        }
    }
}
