import { Exclude, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { BaseEntity } from 'src/common/entities/base.entity'
import { FileEntity } from 'src/common/entities/file.entity'
import { PublicUserEntity } from 'src/common/entities/public-user-entity'
import { ReactionsNumberEntity } from 'src/common/entities/reactions-number.entity'
import { Post } from 'src/common/schemas/post.schema'
import { Reaction } from 'src/common/schemas/reaction.schema'
import { File } from 'src/common/schemas/shared/file.schema'
import { User } from 'src/common/schemas/user.schema'
import { ReactionEntity } from 'src/reactions/entities/reaction.entity'

export class CommentEntity extends BaseEntity {
    text: string
    @Type(() => ReactionEntity)
    reactions: Reaction[]
    @Type(() => PublicUserEntity)
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
