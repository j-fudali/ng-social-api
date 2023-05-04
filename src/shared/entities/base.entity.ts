import { Exclude } from 'class-transformer'

export class BaseEntity {
    @Exclude()
    createdAt: Date
    @Exclude()
    updatedAt: Date
    @Exclude()
    __v: number
    // @Exclude()
    // _id: any
}
