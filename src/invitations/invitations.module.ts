import { Module } from '@nestjs/common'
import { InvitationsService } from './invitations.service'
import { InvitationsController } from './invitations.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
    Conversation,
    ConversationSchema,
} from 'src/common/schemas/conversation.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Conversation.name, schema: ConversationSchema },
        ]),
    ],
    controllers: [InvitationsController],
    providers: [InvitationsService],
})
export class InvitationsModule {}
