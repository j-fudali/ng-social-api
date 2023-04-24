import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
class ReactionsNumber {
  @Prop({ default: 0 })
  likeNumber: number;
  @Prop({ default: 0 })
  dislikeNumber: number;
}
@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  text: string;
  @Prop([String])
  files: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  author: User;
  @Prop({ unique: true })
  categories: string;
  @Prop({ type: ReactionsNumber })
  reactionNumber: ReactionsNumber;
}
export const PostSchema = SchemaFactory.createForClass(Post);
