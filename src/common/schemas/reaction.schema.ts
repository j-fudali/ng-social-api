import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Types } from 'mongoose'
import { User } from './user.schema'

export type ReactionDocument = HydratedDocument<Reaction>

@Schema({ autoIndex: true })
export class Reaction {
    @Prop({ enum: ['like', 'dislike'], required: true })
    reaction: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    author: User
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'reactionFor',
        required: true,
    })
    reactionPlaceId: Types.ObjectId
    @Prop({ enum: ['Post', 'Comment'], required: true })
    reactionFor: string
}
export const ReactionSchema = SchemaFactory.createForClass(Reaction)
ReactionSchema.index(
    { author: 1, reactionPlaceId: 1, reactionFor: 1 },
    { unique: true },
)
