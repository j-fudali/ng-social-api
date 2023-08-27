import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { User } from './user.schema'
import { Message } from './message.schema'

export type ConversationDocument = HydratedDocument<Conversation>
@Schema({ timestamps: true })
export class Conversation {
    @Prop({ required: true })
    name: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    creator: User
    @Prop([
        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ])
    participants: User[]
    @Prop([
        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ])
    invitedUsers: User[]
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
    lastMessage: Message
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation)
