import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common'
import { MessagesService } from './messages.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { IsParticipantGuard } from 'src/conversations/guards/is-participant.guard'
import { IsUserAuthorGuard } from 'src/common/guards/is-user-author.guard'

@Controller('messages')
@UseGuards(JwtStrategyGuard, IsParticipantGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post()
    @UseGuards(IsParticipantGuard)
    create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
        return this.messagesService.create(req.user.userId, createMessageDto)
    }

    @Get(':id')
    @UseGuards(IsParticipantGuard)
    findAll(@Param('id') id: string) {
        return this.messagesService.findAll(id)
    }

    @Delete(':id')
    @UseGuards(IsUserAuthorGuard)
    remove(@Param('id') id: string) {
        return this.messagesService.remove(id)
    }
}

