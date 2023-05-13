import { Exclude, Type } from 'class-transformer'
import { BaseEntity } from 'src/common/entities/base.entity'
import { PublicUserEntity } from 'src/common/entities/public-user-entity'
import { User } from 'src/common/schemas/user.schema'
export class ConversationEntity extends BaseEntity {
    name: string
    @Type(() => PublicUserEntity)
    creator: User
    @Type(() => PublicUserEntity)
    participants: User[]
    @Type(() => PublicUserEntity)
    invitedUsers: User[]
    constructor(partial: Partial<ConversationEntity>) {
        super()
        Object.assign(this, partial)
    }
}
export class ConversationInInvitation extends ConversationEntity {
    @Exclude()
    participants: User[]
    @Exclude()
    invitedUsers: User[]
    constructor(partial: Partial<ConversationInInvitation>) {
        super(partial)
        Object.assign(this, partial)
    }
}

