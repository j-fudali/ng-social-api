import { Type } from 'class-transformer'
import { BaseEntity } from 'src/common/entities/base.entity'
import { PublicUserEntity } from 'src/common/entities/public-user-entity'
import { User } from 'src/common/schemas/user.schema'
import { UserEntity } from 'src/users/entities/user.entity'
class Roles {
    @Type(() => PublicUserEntity)
    administrator: User
    @Type(() => PublicUserEntity)
    moderators: User[]
}

export class GroupEntity extends BaseEntity {
    name: string
    @Type(() => UserEntity)
    participants: User[]
    tags: string[]
    description: string
    @Type(() => Roles)
    roles: Roles
    constructor(partial: Partial<GroupEntity>) {
        super()
        Object.assign(this, partial)
    }
}
