import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema()
export class Reaction {
  @Prop({ enum: ['like', 'dislike'], required: true })
  reaction: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: User;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'reactionFor',
    required: true,
  })
  reactionPlaceId: number;
  @Prop({ enum: ['Post', 'Comment'], required: true })
  reactionFor: string;
}
export const ReactionSchema = SchemaFactory.createForClass(Reaction);
