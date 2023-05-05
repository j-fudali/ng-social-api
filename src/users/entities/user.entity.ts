import { Exclude, Transform } from 'class-transformer'
import { Types } from 'mongoose'
import { BaseEntity } from 'src/common/entities/base.entity'

export class UserEntity extends BaseEntity {
    _id: Types.ObjectId
    username: string
    firstname: string
    lastname: string
    email: string
    birthdate: Date
    phone: string
    @Exclude()
    password: string
    @Exclude()
    hash: string

    constructor(partial: Partial<UserEntity>) {
        super()
        Object.assign(this, partial)
    }
}
