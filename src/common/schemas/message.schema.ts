import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { User } from './user.schema'
import { Conversation } from './conversation.schema'
import { File } from './shared/file.schema'

export type MessageDocument = HydratedDocument<Message>
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Message {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    })
    conversation: Conversation
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    author: User
    @Prop({ required: true })
    text: string
    @Prop([File])
    files: File[]
}
export const MessageSchema = SchemaFactory.createForClass(Message)
