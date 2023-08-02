import { PickType } from '@nestjs/mapped-types'
import { UserEntity } from './user.entity'
import { Types } from 'mongoose'
import { Exclude } from 'class-transformer'

export class UserShortEntity extends UserEntity {
    _id: Types.ObjectId
    username: string
    firstname: string
    lastname: string
    @Exclude()
    email: string
    @Exclude()
    birthdate: Date
    @Exclude()
    phone: string
    @Exclude()
    isVisible: boolean
    @Exclude()
    password: string
    @Exclude()
    hash: string
    constructor(partial: Partial<UserShortEntity>) {
        super(partial)
        Object.assign(this, partial)
    }
}
