import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/common/schemas/user.schema'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { retry } from 'rxjs'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async getUser(username: string) {
        const user = await this.userModel.findOne({ username }).exec()
        if (!user) throw new NotFoundException()
        return user
    }
    async createUser(userData: CreateUserDto) {
        try {
            const salt = bcrypt.genSaltSync()
            const { password, ...rest } = userData
            const hashPassword = bcrypt.hashSync(password, salt)
            const req = await this.userModel.create({
                ...rest,
                password: hashPassword,
                hash: salt,
            })
            if (!req) throw new BadRequestException()
            return req
        } catch {
            throw new BadRequestException()
        }
    }

    async updateUser(id: string, userData: UpdateUserDto) {
        if (!id) throw new BadRequestException()
        try {
            const req = await this.userModel.findByIdAndUpdate(
                id,
                { phone: userData.phone },
                { new: true },
            )
            if (!req) throw new NotFoundException()
            return req
        } catch {
            throw new BadRequestException()
        }
    }
    async deleteUser(id: string) {
        if (!id) throw new BadRequestException()
        try {
            const req = await this.userModel.findByIdAndDelete(id)
            if (!req) throw new BadRequestException()
            return req
        } catch {
            throw new BadRequestException()
        }
    }
}

