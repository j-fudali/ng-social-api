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
import { ConversationsService } from './conversations.service'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { UpdateConversationDto } from './dto/update-conversation.dto'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { IsParticipantGuard } from './guards/is-participant.guard'
import { ConversationEntity } from '../common/dto/conversation.entity'

@Controller('conversations')
@UseGuards(JwtStrategyGuard)
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}
    @Post()
    async create(
        @Request() req,
        @Body() createConversationDto: CreateConversationDto,
    ) {
        return await this.conversationsService.create(
            req.user.userId,
            createConversationDto,
        )
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAllUserParticipate(@Request() req) {
        return (
            await this.conversationsService.findAllUserParticipate(
                req.user.userId,
            )
        ).map((c) => new ConversationEntity(c))
    }
    @Get(':id')
    @UseGuards(IsParticipantGuard)
    findOne(@Request() req) {
        // return this.conversationsService.findOne(id)
        return req.conversation
    }
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateConversationDto: UpdateConversationDto,
    ) {
        return await this.conversationsService.update(id, updateConversationDto)
    }
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.conversationsService.remove(+id)
    }
}

