import { Exclude } from 'class-transformer'
import { Types } from 'mongoose'

export class FileEntity {
    url: string
    hash: string
    @Exclude()
    _id?: Types.ObjectId
}
