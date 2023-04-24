import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/common/dto/schemas/user.schema'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    getUser(username: string) {
        return this.userModel.findOne({ username }).exec()
    }
}

