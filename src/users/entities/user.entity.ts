import { Exclude } from 'class-transformer'
export class UserEntity {
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
    @Exclude()
    createdAt: Date
    @Exclude()
    updatedAt: Date
    @Exclude()
    __v: number
    @Exclude()
    _id: string
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)
    }
}
