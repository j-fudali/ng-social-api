import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { User } from './user.schema'
import { File } from './shared/file.schema'
import { Group } from './group.schema'
import { Reaction } from './reaction.schema'

export type PostDocument = HydratedDocument<Post>

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true })
    title: string
    @Prop({ required: true })
    text: string
    @Prop([{ type: File, ref: 'File' }])
    files: File[]
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    author: User
    @Prop({ type: [String] })
    categories: string[]
    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Reaction',
            },
        ],
        default: [],
    })
    reactions: Reaction[]
    @Prop({
        required: true,
        enum: ['public', 'private', 'group'],
    })
    visibility: string
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    })
    group: Group
}
export const PostSchema = SchemaFactory.createForClass(Post)
