import { Prop, Schema } from '@nestjs/mongoose'

@Schema({ _id: false })
export class ReactionsNumber {
    @Prop({ default: 0 })
    likesNumber: number
    @Prop({ default: 0 })
    dislikesNumber: number
}
