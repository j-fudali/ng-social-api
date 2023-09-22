import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, mongo } from 'mongoose'
import { User } from './user.schema'
import { ReactionsNumber } from './shared/reactions-number.schema'
import { File } from './shared/file.schema'
import { Post } from './post.schema'
import { Reaction } from './reaction.schema'

export type CommentDocument = HydratedDocument<Comment>
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Comment {
    @Prop({ required: true })
    text: string
    @Prop({ type: File })
    image: File
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    author: User
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
    post: Post
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }],
        default: [],
    })
    reactions: Reaction[]
}
export const CommentSchema = SchemaFactory.createForClass(Comment)
