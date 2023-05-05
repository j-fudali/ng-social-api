import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/common/schemas/user.schema'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async getUser(username: string) {
        const user = await this.userModel.findOne({ username }).exec()
        if (!user) throw new NotFoundException()
        return user
    }
    async createUser(userData: CreateUserDto) {
        const salt = bcrypt.genSaltSync()
        const { password, ...rest } = userData
        const hashPassword = bcrypt.hashSync(password, salt)
        const req = new this.userModel({
            ...rest,
            password: hashPassword,
            hash: salt,
        })
        if (!req) throw new BadRequestException()
        await req.save()
        return { message: 'User has been created' }
    }

    async updateUser(id: string, userData: UpdateUserDto) {
        const req = await this.userModel
            .findByIdAndUpdate(id, { phone: userData.phone }, { new: true })
            .lean()
        if (!req) throw new NotFoundException()
        return req
    }
    async deleteUser(id: string) {
        const req = await this.userModel.findByIdAndDelete(id).lean()
        if (!req) throw new BadRequestException()
        return req
    }
}

