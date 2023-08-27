import { Transform, Type } from 'class-transformer'
import { BaseEntity } from 'src/common/entities/base.entity'
import { FileEntity } from 'src/common/entities/file.entity'
import { PublicUserEntity } from 'src/common/entities/public-user-entity'
import { ReactionsNumberEntity } from 'src/common/entities/reactions-number.entity'
import { Group } from 'src/common/schemas/group.schema'
import { File } from 'src/common/schemas/shared/file.schema'
import { ReactionsNumber } from 'src/common/schemas/shared/reactions-number.schema'
import { User } from 'src/common/schemas/user.schema'
import { GroupEntity } from 'src/groups/entities/group.entity'

export class PostEntity extends BaseEntity {
    title: string
    text: string
    @Type(() => FileEntity)
    files: File[]
    @Type(() => PublicUserEntity)
    author: User
    categories: string[]
    @Type(() => ReactionsNumberEntity)
    reactionsNumber: ReactionsNumber
    visibility: string
    @Type(() => GroupEntity)
    group: Group
    constructor(partial: Partial<PostEntity>) {
        super()
        Object.assign(this, partial)
    }
}
