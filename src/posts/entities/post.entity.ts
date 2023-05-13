import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { User } from 'src/common/schemas/user.schema'
import { BaseEntity } from 'src/common/entities/base.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import { ReactionsNumber } from 'src/common/entities/reactions-number.entity'
import { File } from 'src/common/entities/file.entity'

export class PostEntity extends BaseEntity {
    title: string
    text: string
    @Type(() => UserEntity)
    author: User
    categories: string[]
    @Type(() => File)
    files: File[]
    @Type(() => ReactionsNumber)
    reactionsNumber: ReactionsNumber
    constructor(partial: Partial<PostEntity>) {
        super()
        Object.assign(this, partial)
    }
}
export class SinglePostEntity extends PostEntity {
    @Exclude()
    _id: Types.ObjectId
    constructor(partial: Partial<SinglePostEntity>) {
        super(partial)
        Object.assign(this, partial)
    }
}
