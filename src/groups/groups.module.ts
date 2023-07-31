import { Module } from '@nestjs/common'
import { GroupsService } from './groups.service'
import { GroupsController } from './groups.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Group, GroupSchema } from 'src/common/schemas/group.schema'

@Module({
    controllers: [GroupsController],
    providers: [GroupsService],
    imports: [
        MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    ],
})
export class GroupsModule {}
