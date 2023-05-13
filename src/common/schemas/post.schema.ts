import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { User } from './user.schema'
import { ReactionsNumber } from './shared/reactions-number.schema'
import { File } from './shared/file.schema'

export type PostDocument = HydratedDocument<Post>

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true })
    title: string
    @Prop({ required: true })
    text: string
    @Prop([{ type: File }])
    files: File[]
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    author: User
    @Prop({ type: [String] })
    categories: string[]
    @Prop({
        type: ReactionsNumber,
        default: {},
    })
    reactionsNumber: ReactionsNumber
}
export const PostSchema = SchemaFactory.createForClass(Post)
