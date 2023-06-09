import { Exclude, Transform } from 'class-transformer'
import { Types } from 'mongoose'

export class BaseEntity {
    @Exclude()
    createdAt: Date
    @Exclude()
    updatedAt: Date
    @Exclude()
    __v: number
    @Transform(({ value }) => value.toString())
    _id: Types.ObjectId
}
