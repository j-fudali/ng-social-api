import { Injectable } from '@nestjs/common'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Group } from 'src/common/schemas/group.schema'
import { Model } from 'mongoose'

@Injectable()
export class GroupsService {
    constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}
    async create(createGroupDto: CreateGroupDto, userId: string) {
        const roles = {
            administrator: userId,
            moderators: createGroupDto.moderatores,
        }
        const group = new this.groupModel({ ...createGroupDto, roles })
        await group.save()
        return group
    }

    async findAll() {
        return await this.groupModel.find().lean().exec()
    }

    findOne(id: number) {
        return `This action returns a #${id} group`
    }

    update(id: number, updateGroupDto: UpdateGroupDto) {
        return `This action updates a #${id} group`
    }

    remove(id: number) {
        return `This action removes a #${id} group`
    }
}
