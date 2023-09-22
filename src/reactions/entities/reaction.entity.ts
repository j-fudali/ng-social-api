import { Type } from 'class-transformer'
import { User } from 'src/common/schemas/user.schema'
import { BaseEntity } from 'src/common/entities/base.entity'
import { PublicUserEntity } from 'src/common/entities/public-user-entity'

export class ReactionEntity extends BaseEntity {
    reaction: string
    @Type(() => PublicUserEntity)
    author: User
    constructor(partial: Partial<ReactionEntity>) {
        super()
        Object.assign(this, partial)
    }
}
