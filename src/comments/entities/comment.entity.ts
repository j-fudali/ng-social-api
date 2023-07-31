import { Exclude, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { BaseEntity } from 'src/common/entities/base.entity'
import { FileEntity } from 'src/common/entities/file.entity'
import { ReactionsNumber } from 'src/common/entities/reactions-number.entity'
import { Post } from 'src/common/schemas/post.schema'
import { File } from 'src/common/schemas/shared/file.schema'
import { User } from 'src/common/schemas/user.schema'
import { UserEntity } from 'src/users/entities/user.entity'

export class CommentEntity extends BaseEntity {
    _id: Types.ObjectId
    text: string
    @Type(() => ReactionsNumber)
    reactionsNumber: ReactionsNumber
    @Type(() => UserEntity)
    author: User
    @Exclude()
    post: Post
    @Type(() => FileEntity)
    image: File
    constructor(partial: Partial<CommentEntity>) {
        super()
        Object.assign(this, partial)
    }
}

export class SingleCommentEntity extends CommentEntity {
    @Exclude()
    _id: Types.ObjectId
    constructor(partial: Partial<SingleCommentEntity>) {
        super(partial)
        Object.assign(this, partial)
    }
}

