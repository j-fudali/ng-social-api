import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Reaction } from '../../common/schemas/reaction.schema'

@Injectable()
export class IsUserReactionAuthorGuard implements CanActivate {
    constructor(
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const paramId = request.params.id
        const userId = request.user.userId
        const req = await this.reactionModel.findById(paramId)
        if (!req) throw new NotFoundException('Reaction not found')
        return req.author.toString() === userId ? true : false
    }
}
