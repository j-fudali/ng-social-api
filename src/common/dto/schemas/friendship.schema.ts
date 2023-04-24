import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type FriendshipDocument = HydratedDocument<Friendship>;
@Schema({ timestamps: true })
export class Friendship {
  @Prop({ enum: ['requested', 'pending', 'friends'], required: true })
  status: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  recipient: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  requester: User;
}
export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
