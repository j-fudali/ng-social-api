import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post } from 'src/common/schemas/post.schema'
import { Reaction } from 'src/common/schemas/reaction.schema'
import { Comment } from '../schemas/comment.schema'

@Injectable()
export class IsUserAuthorGuard implements CanActivate {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
    ) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const paramId = request.params.id
        const userId = request.user.userId
        const path = request.route.path
        if (path.includes('posts')) {
            try {
                const req = await this.postModel.findById(paramId)
                if (!req) throw new NotFoundException('Post not found')
                return req.author.toString() === userId ? true : false
            } catch (error) {
                throw new BadRequestException('Invalid data provided')
            }
        } else if (path.includes('reactions')) {
            try {
                const req = await this.reactionModel.findById(paramId)
                if (!req) throw new NotFoundException('Reaction not found')
                return req.author.toString() === userId ? true : false
            } catch (error) {
                throw new BadRequestException('Invalid data provided')
            }
        } else if (path.includes('comments')) {
            try {
                const req = await this.commentModel.findById(paramId)
                if (!req) throw new NotFoundException('Comment not found')
                return req.author.toString() === userId ? true : false
            } catch (error) {
                throw new BadRequestException('Invalid data provided')
            }
        } else if (path.includes('messages')) {
            try {
                const req = await this.commentModel.findById(paramId)
                if (!req) throw new NotFoundException('Comment not found')
                return req.author.toString() === userId ? true : false
            } catch (error) {
                throw new BadRequestException('Invalid data provided')
            }
        } else {
            throw new InternalServerErrorException()
        }
    }
}

