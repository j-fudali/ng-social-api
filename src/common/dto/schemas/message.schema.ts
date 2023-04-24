import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type MessageDocument = HydratedDocument<Message>;
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  })
  conversationId: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  author: User;
  @Prop({ required: true })
  text: string;
  @Prop([String])
  files: string[];
}
export const MessageSchema = SchemaFactory.createForClass(Message);
