import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message } from '../../common/schemas/message.schema'

@Injectable()
export class IsUserMessageAuthorGuard implements CanActivate {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const paramId = request.params.id
        const userId = request.user.userId
        try {
            const req = await this.messageModel.findById(paramId)
            if (!req) throw new NotFoundException('Comment not found')
            return req.author.toString() === userId ? true : false
        } catch (error) {
            throw new BadRequestException('Invalid data provided')
        }
    }
}

