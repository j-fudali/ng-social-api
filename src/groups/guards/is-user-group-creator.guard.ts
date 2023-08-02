/*
https://docs.nestjs.com/guards#guards
*/

import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Group } from 'src/common/schemas/group.schema'

@Injectable()
export class IsUserGroupCreatorGuard implements CanActivate {
    constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const paramId = request.params.id
        const userId = request.user.userId
        try {
            const req = await this.groupModel.findById(paramId)
            if (!req) throw new NotFoundException('Group not found')
            return req.roles.administrator.toString() === userId ? true : false
        } catch (error) {
            throw new BadRequestException('Invalid data provided')
        }
    }
}
