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
    Query,
    BadRequestException,
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { UpdateGroupDto } from './dto/update-group.dto'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { GroupEntity } from './entities/group.entity'
import { PaginationParams } from 'src/common/dto/pagination-params'
import { IsUserGroupCreatorGuard } from './guards/is-user-group-creator.guard'
import { MongoIdParamPipe } from 'src/common/pipes/mongo-id-param.pipe'

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Post()
    @UseGuards(JwtStrategyGuard)
    create(@Request() req, @Body() createGroupDto: CreateGroupDto) {
        return this.groupsService.create(createGroupDto, req.user.userId)
    }

    @Get()
    async findAll(@Query() { skip, limit }: PaginationParams) {
        return this.groupsService.findAll(skip, limit)
    }

    @Get(':id')
    findOne(@Param('id', MongoIdParamPipe) id: string) {
        if (!id) throw new BadRequestException('Group id not provided')
        return this.groupsService.findOne(id)
    }

    @Patch(':id')
    @UseGuards(JwtStrategyGuard, IsUserGroupCreatorGuard)
    update(
        @Param('id', MongoIdParamPipe) id: string,
        @Body() updateGroupDto: UpdateGroupDto,
    ) {
        if (!id) throw new BadRequestException('Group id not provided')
        return this.groupsService.update(id, updateGroupDto)
    }

    @Delete(':id')
    @UseGuards(JwtStrategyGuard, IsUserGroupCreatorGuard)
    remove(@Param('id', MongoIdParamPipe) id: string) {
        if (!id) throw new BadRequestException('Group id not provided')
        return this.groupsService.remove(id)
    }
}
