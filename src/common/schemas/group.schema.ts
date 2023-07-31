import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { User } from './user.schema'

@Schema()
class Roles {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    administrator: User
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    })
    moderators: User[]
}

export type GroupDocument = HydratedDocument<Group>
@Schema()
export class Group {
    @Prop({ required: true })
    name: string
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    participants: User[]
    @Prop({
        required: true,
        validate: [(val) => val.length > 2, 'Must have at least 3 values'],
    })
    tags: string[]
    @Prop()
    description: string
    @Prop()
    roles: Roles
}
export const GroupSchema = SchemaFactory.createForClass(Group)
