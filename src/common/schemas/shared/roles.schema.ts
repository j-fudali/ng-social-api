import { Prop, Schema } from '@nestjs/mongoose'
import { User } from '../user.schema'
import mongoose from 'mongoose'

@Schema({ _id: false })
export class Roles {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    administrator: User
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    })
    moderators: User[]
}
