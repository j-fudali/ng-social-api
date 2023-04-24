import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    firstname: string
    @Prop({ required: true })
    lastname: string
    @Prop({ required: true, unique: true })
    email: string
    @Prop({ required: true })
    birthdate: Date
    @Prop({ required: true })
    password: string
    @Prop({ required: true })
    hash: string
    @Prop({ required: true })
    phone: string
}
export const UserSchema = SchemaFactory.createForClass(User)
