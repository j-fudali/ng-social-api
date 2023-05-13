import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export class File {
    @Prop({ required: true })
    url: string
    @Prop({ required: true })
    hash: string
}
