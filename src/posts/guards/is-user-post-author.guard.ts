import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post } from '../../common/schemas/post.schema'

@Injectable()
export class IsUserPostAuthorGuard implements CanActivate {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const paramId = request.params.id
        const userId = request.user.userId
        try {
            const req = await this.postModel.findById(paramId)
            if (!req) throw new NotFoundException('Post not found')
            return req.author.toString() === userId ? true : false
        } catch (error) {
            throw new BadRequestException('Invalid data provided')
        }
    }
}

