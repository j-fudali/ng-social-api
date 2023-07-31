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
import { ConversationEntity } from '../common/dto/conversation.entity'
import { IsUserConversationAuthorGuard } from './guards/is-user-conversation-author.guard'

@Controller('conversations')
@UseGuards(JwtStrategyGuard)
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}
    @Post()
    create(
        @Request() req,
        @Body() createConversationDto: CreateConversationDto,
    ) {
        return this.conversationsService.create(
            req.user.userId,
            createConversationDto,
        )
    }
    //TODO Invitations to conversations
    // @Post(':id')
    // addToConversation() {}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAllUserParticipate(@Request() req) {
        return (
            await this.conversationsService.findAllUserParticipate(
                req.user.userId,
            )
        ).map((c) => new ConversationEntity(c))
    }

    @Patch(':id')
    @UseInterceptors(IsUserConversationAuthorGuard)
    async update(
        @Param('id') id: string,
        @Body() updateConversationDto: UpdateConversationDto,
    ) {
        return await this.conversationsService.update(id, updateConversationDto)
    }
    @Delete(':id')
    @UseInterceptors(IsUserConversationAuthorGuard)
    async remove(@Param('id') id: string) {
        return await this.conversationsService.remove(+id)
    }
}
