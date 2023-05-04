import { Exclude, Expose, Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { BaseEntity } from 'src/shared/entities/base.entity'
export class PostFile {
    url: string
    hash: string
    @Exclude()
    _id?: any
}
export class PostEntity extends BaseEntity {
    @Transform(({ value }) => value._id.toString())
    _id: Types.ObjectId
    title: string
    text: string
    categories: string[]
    @Type(() => PostFile)
    files: PostFile[]
    constructor(partial: Partial<PostEntity>) {
        super()
        Object.assign(this, partial)
    }
}
export class SinglePostEntity extends PostEntity {
    @Exclude()
    _id: Types.ObjectId
}
