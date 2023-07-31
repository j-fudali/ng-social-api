import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Request,
    UseInterceptors,
    ClassSerializerInterceptor,
    UploadedFiles,
} from '@nestjs/common'
import { MessagesService } from './messages.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { IsParticipantGuard } from 'src/conversations/guards/is-participant.guard'
import { IsUserMessageAuthorGuard } from 'src/messages/guards/is-user-message-author.guard'
import { ValidMongoObjectId } from 'src/common/dto/valid-mongo-objectId'
import { FindAllInConversation } from './dto/find-all-in-conversation.dto'
import { MessageEntity } from './entities/message.entity'
import { FilesInterceptor } from '@nestjs/platform-express'

@Controller('messages')
@UseGuards(JwtStrategyGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post()
    @UseGuards(IsParticipantGuard)
    create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
        return this.messagesService.create(req.user.userId, createMessageDto)
    }
    @Post(':id/upload')
    @UseGuards(IsUserMessageAuthorGuard)
    @UseInterceptors(
        FilesInterceptor('files', null, {
            limits: {
                fieldSize: 5 * 1024 * 1024,
            },
        }),
    )
    async upload(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Param() params: ValidMongoObjectId,
    ) {
        return this.messagesService.uploadFiles(files, params.id)
    }
    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(IsParticipantGuard)
    async findAllInConversation(@Body() body: FindAllInConversation) {
        return (
            await this.messagesService.findAllInConversation(
                body.conversationId,
            )
        ).map((m) => new MessageEntity(m))
    }

    @Delete(':id')
    @UseGuards(IsUserMessageAuthorGuard)
    remove(@Param() params: ValidMongoObjectId) {
        return this.messagesService.remove(params.id)
    }
}
