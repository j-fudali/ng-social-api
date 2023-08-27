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
import { UserEntity } from './entities/user.entity'
import { PublicUserEntity } from 'src/common/entities/public-user-entity'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getVisibleUsers(
        search,
        page = 0,
        limit = 4,
    ): Promise<{ result: PublicUserEntity[]; count: number }> {
        //Rewrite using facet pipeline
        const query = this.userModel
            .aggregate()
            .search({
                index: 'users_search',
                compound: {
                    should: [
                        {
                            autocomplete: {
                                path: 'username',
                                query: search,
                                tokenOrder: 'any',
                            },
                        },
                        {
                            autocomplete: {
                                path: 'firstname',
                                query: search,
                                tokenOrder: 'any',
                            },
                        },
                        {
                            autocomplete: {
                                path: 'lastname',
                                query: search,
                                tokenOrder: 'any',
                            },
                        },
                    ],
                },
            })
            .match({
                isVisible: true,
            })
        const count = (await query).length
        query
            .sort({ _id: 1 })
            .skip(page * limit)
            .limit(limit)
            .project({
                username: 1,
                firstname: 1,
                lastname: 1,
            })

        const result = (await query).map((u) => new PublicUserEntity(u))
        return { result, count }
    }

    async getUserByUsername(username: string): Promise<PublicUserEntity> {
        const user = await this.userModel.findOne({ username }).lean().exec()
        if (!user) throw new NotFoundException('User not found')
        return new PublicUserEntity(user)
    }
    async getUserByEmail(email: string): Promise<PublicUserEntity> {
        const user = await this.userModel.findOne({ email }).lean().exec()
        if (!user) throw new NotFoundException('User not found')
        return new PublicUserEntity(user)
    }
    async getUserProfile(username: string): Promise<UserEntity> {
        const user = await this.userModel.findOne({ username }).lean().exec()
        if (!user) throw new NotFoundException('User not found')
        return new UserEntity(user)
    }
    async createUser(userData: CreateUserDto) {
        const salt = bcrypt.genSaltSync()
        const { password, ...rest } = userData
        const hashPassword = bcrypt.hashSync(password, salt)
        const user = new this.userModel({
            ...rest,
            password: hashPassword,
            hash: salt,
        })
        if (!user) throw new BadRequestException()
        await user.save()
        return user
    }

    async updateUser(id: string, userData: UpdateUserDto) {
        if (!(userData.phone || userData.isVisible))
            throw new BadRequestException('Bad data to update providede')
        const req = await this.userModel
            .findByIdAndUpdate(
                id,
                { phone: userData.phone, isVisible: userData.isVisible },
                { new: true },
            )
            .lean()
        if (!req) throw new NotFoundException()
        return req
    }
    async deleteUser(id: string) {
        try {
            const user = await this.userModel.findById(id)
            user.username = `DELETED-${id}`
            user.firstname = undefined
            user.lastname = undefined
            user.email = undefined
            user.birthdate = undefined
            user.password = undefined
            user.hash = undefined
            user.phone = undefined
            user.isVisible = undefined
            await user.save()
            return { message: 'User has been deleted' }
        } catch {
            throw new BadRequestException('Cannot delete user profile')
        }
    }
}
