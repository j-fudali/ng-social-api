import { Type } from 'class-transformer'
import { BaseEntity } from 'src/common/entities/base.entity'
import { User } from 'src/common/schemas/user.schema'
import { UserEntity } from 'src/users/entities/user.entity'
class Roles {
    @Type(() => UserEntity)
    administrator: User
    @Type(() => UserEntity)
    moderators: User[]
}

export class GroupEntity extends BaseEntity {
    name: string
    @Type(() => UserEntity)
    participants: User[]
    tags: string[]
    description: string
    roles: Roles
    constructor(partial: Partial<GroupEntity>) {
        super()
        Object.assign(this, partial)
    }
}
