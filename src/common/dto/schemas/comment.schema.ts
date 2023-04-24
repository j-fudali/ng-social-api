import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
@Schema()
class ReactionsNumber {
  @Prop({ default: 0 })
  likeNumber: number;
  @Prop({ default: 0 })
  dislikeNumber: number;
}
export type CommentDocument = HydratedDocument<Comment>;
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Comment {
  @Prop({ required: true })
  text: string;
  @Prop()
  image: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  postId: number;
  @Prop({ type: ReactionsNumber })
  reactionsNumber: ReactionsNumber;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
