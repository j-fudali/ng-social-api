import { Exclude, Transform } from 'class-transformer'
import { Types } from 'mongoose'
import { BaseEntity } from 'src/shared/entities/base.entity'

export class UserEntity extends BaseEntity {
    @Exclude()
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
