import { Exclude, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { User } from 'src/common/schemas/user.schema'
import { BaseEntity } from 'src/common/entities/base.entity'
import { UserEntity } from 'src/users/entities/user.entity'

export class ReactionEntity extends BaseEntity {
    _id: Types.ObjectId
    reaction: string
    @Type(() => UserEntity)
    author: User
    @Exclude()
    reactionPlaceId: Types.ObjectId
    @Exclude()
    reactionFor: string
    constructor(partial: Partial<ReactionEntity>) {
        super()
        Object.assign(this, partial)
    }
}
