import { Exclude, Expose, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { BaseEntity } from 'src/common/entities/base.entity'
import { User } from 'src/common/schemas/user.schema'
import { UserEntity } from 'src/users/entities/user.entity'

export class FriendshipEntity extends BaseEntity {
    @Exclude()
    _id: Types.ObjectId
    status: string
    @Type(() => UserEntity)
    requester: UserEntity
    @Type(() => UserEntity)
    recipient: UserEntity
    constructor(partial: Partial<FriendshipEntity>) {
        super()
        Object.assign(this, partial)
    }
}
