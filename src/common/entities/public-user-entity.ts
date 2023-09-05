import { Exclude } from 'class-transformer'
import { UserEntity } from 'src/users/entities/user.entity'

export class PublicUserEntity extends UserEntity {
    @Exclude()
    email: string
    @Exclude()
    phone: string
    @Exclude()
    birthdate: Date
    @Exclude()
    createdAt: Date
    @Exclude()
    updatedAt: Date
    constructor(partial: Partial<PublicUserEntity>) {
        super(partial)
        Object.assign(this, partial)
    }
}
