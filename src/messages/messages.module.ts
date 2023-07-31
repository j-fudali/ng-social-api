import { Module } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { MessagesController } from './messages.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Message, MessageSchema } from 'src/common/schemas/message.schema'
import {
    Conversation,
    ConversationSchema,
} from 'src/common/schemas/conversation.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: Conversation.name, schema: ConversationSchema },
        ]),
    ],
    controllers: [MessagesController],
    providers: [MessagesService],
})
export class MessagesModule {}

