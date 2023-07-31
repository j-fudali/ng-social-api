import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { GroupEntity } from './entities/group.entity'

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Post()
    @UseGuards(JwtStrategyGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(@Request() req, @Body() createGroupDto: CreateGroupDto) {
        return new GroupEntity(
            await this.groupsService.create(createGroupDto, req.user.userId),
        )
    }

    @Get()
    findAll() {
        return this.groupsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.groupsService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
        return this.groupsService.update(+id, updateGroupDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.groupsService.remove(+id)
    }
}
