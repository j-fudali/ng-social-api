import { Exclude } from 'class-transformer'
import { Types } from 'mongoose'

export class FileEntity {
    url: string
    @Exclude()
    hash: string
    @Exclude()
    _id?: Types.ObjectId
}
