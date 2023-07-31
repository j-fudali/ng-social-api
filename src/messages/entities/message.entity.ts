import { Exclude, Expose, Type } from 'class-transformer'
import { BaseEntity } from 'src/common/entities/base.entity'
import { FileEntity } from 'src/common/entities/file.entity'
import { PublicUserEntity } from 'src/common/entities/public-user-entity'
import { Conversation } from 'src/common/schemas/conversation.schema'
import { File } from 'src/common/schemas/shared/file.schema'
import { User } from 'src/common/schemas/user.schema'

export class MessageEntity extends BaseEntity {
    @Exclude()
    conversation: Conversation
    @Type(() => PublicUserEntity)
    author: User
    text: string
    @Type(() => FileEntity)
    files: File[]
    createdAt: Date
    constructor(partial: Partial<MessageEntity>) {
        super()
        Object.assign(this, partial)
    }
}
