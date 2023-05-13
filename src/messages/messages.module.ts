import { Module } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { MessagesController } from './messages.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Message, MessageSchema } from 'src/common/schemas/message.schema'
import { FilesUploadModule } from 'src/files-upload/files-upload.module'
import {
    Conversation,
    ConversationSchema,
} from 'src/common/schemas/conversation.schema'
import { Reaction, ReactionSchema } from 'src/common/schemas/reaction.schema'
import { Comment, CommentSchema } from 'src/common/schemas/comment.schema'
import { Post, PostSchema } from 'src/common/schemas/post.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: Conversation.name, schema: ConversationSchema },
            { name: Reaction.name, schema: ReactionSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: Post.name, schema: PostSchema },
        ]),
        FilesUploadModule,
    ],
    controllers: [MessagesController],
    providers: [MessagesService],
})
export class MessagesModule {}

