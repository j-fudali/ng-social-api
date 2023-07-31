import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Comment } from '../../common/schemas/comment.schema'

@Injectable()
export class IsUserCommentAuthorGuard implements CanActivate {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const paramId = request.params.id
        const userId = request.user.userId
        try {
            const req = await this.commentModel.findById(paramId)
            if (!req) throw new NotFoundException('Comment not found')
            return req.author.toString() === userId ? true : false
        } catch (error) {
            throw new BadRequestException('Invalid data provided')
        }
    }
}
