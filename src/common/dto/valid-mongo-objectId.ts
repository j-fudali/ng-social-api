import { IsMongoId, IsNotEmpty } from 'class-validator'

export class ValidMongoObjectId {
    @IsNotEmpty()
    @IsMongoId()
    id: string
}
