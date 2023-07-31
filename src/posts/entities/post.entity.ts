import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { User } from 'src/common/schemas/user.schema'
import { BaseEntity } from 'src/common/entities/base.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import { ReactionsNumber } from 'src/common/entities/reactions-number.entity'
import { FileEntity } from 'src/common/entities/file.entity'
import { File } from 'src/common/schemas/shared/file.schema'
import { PublicUserEntity } from 'src/common/entities/public-user-entity'
import { Group } from 'src/common/schemas/group.schema'

export class PostEntity extends BaseEntity {
    title: string
    text: string
    @Type(() => PublicUserEntity)
    author: User
    categories: string[]
    @Type(() => FileEntity)
    files: File[]
    @Type(() => ReactionsNumber)
    reactionsNumber: ReactionsNumber
    membership: string
    group: Group
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
