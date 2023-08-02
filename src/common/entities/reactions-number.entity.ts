import { Exclude } from 'class-transformer'
import { Types } from 'mongoose'

export class ReactionsNumberEntity {
    likesNumber: number
    dislikesNumber: number
    @Exclude()
    _id?: Types.ObjectId
}
