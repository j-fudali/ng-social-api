import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Group } from 'src/common/schemas/group.schema'
import { Model } from 'mongoose'

@Injectable()
export class GroupsService {
    constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}
    async create(createGroupDto: CreateGroupDto, userId: string) {
        try {
            const roles = {
                administrator: userId,
                moderators: createGroupDto.moderatores,
            }
            const group = new this.groupModel({ ...createGroupDto, roles })
            await group.save()
            return { message: 'Group has been created', groupId: group.id }
        } catch {
            throw new UnprocessableEntityException('Cannot create new group')
        }
    }

    async findAll(skip: number, limit: number) {
        const query = this.groupModel.find({})
        const result = await query
            .select({
                _id: 0,
                id: { $toString: '$_id' },
                name: 1,
                description: 1,
                tags: 1,
            })
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
        const count = await this.groupModel.count()
        return { result, count }
    }

    async findOne(id: string) {
        const result = await this.groupModel
            .findById(id)
            .select({
                _id: 0,
                name: 1,
                description: 1,
                tags: 1,
                roles: 1,
                participants: 1,
            })
            .populate('roles.administrator', {
                _id: 0,
                id: { $toString: '$_id' },
                username: 1,
                firstname: 1,
                lastname: 1,
            })
            .populate('roles.moderators', {
                _id: 0,
                id: { $toString: '$_id' },
                username: 1,
                firstname: 1,
                lastname: 1,
            })
            .populate('participants', {
                _id: 0,
                id: { $toString: '$_id' },
                username: 1,
                firstname: 1,
                lastname: 1,
            })
            .lean()
            .exec()
        if (!result) throw new NotFoundException('Group not found')
        return result
    }

    async update(id: string, updateGroupDto: UpdateGroupDto) {
        const group = await this.groupModel.findByIdAndUpdate(
            id,
            updateGroupDto,
        )
        if (!group) throw new NotFoundException('Group not found')
        return { message: 'Group has been updated' }
    }

    async remove(id: string) {
        const group = await this.groupModel.findByIdAndDelete(id)
        if (!group) throw new NotFoundException('Group not found')
        return { message: 'Group has been deleted' }
    }
}
