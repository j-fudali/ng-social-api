import { Exclude, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'

export class BaseEntity {
    createdAt: Date
    updatedAt: Date
    @Exclude()
    __v: number
    @Type(() => String)
    _id: Types.ObjectId
}
