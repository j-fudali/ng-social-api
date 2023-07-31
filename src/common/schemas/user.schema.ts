import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
    @Prop({ unique: true })
    username: string
    @Prop()
    firstname: string
    @Prop()
    lastname: string
    @Prop({ unique: true })
    email: string
    @Prop()
    birthdate: Date
    @Prop()
    password: string
    @Prop()
    hash: string
    @Prop()
    phone: string
    @Prop()
    isVisible: boolean
}
export const UserSchema = SchemaFactory.createForClass(User)
