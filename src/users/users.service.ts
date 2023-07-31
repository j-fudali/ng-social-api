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

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getVisibleUsers(
        search: string,
        documentsToSkip = 0,
        limitOfDocuments?: number,
    ) {
        try {
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
                                    fuzzy: {
                                        maxEdits: 2,
                                        prefixLength: 1,
                                        maxExpansions: 256,
                                    },
                                },
                            },
                            {
                                autocomplete: {
                                    path: 'firstname',
                                    query: search,
                                    tokenOrder: 'any',
                                    fuzzy: {
                                        maxEdits: 2,
                                        prefixLength: 1,
                                        maxExpansions: 256,
                                    },
                                },
                            },
                            {
                                autocomplete: {
                                    path: 'lastname',
                                    query: search,
                                    tokenOrder: 'any',
                                    fuzzy: {
                                        maxEdits: 2,
                                        prefixLength: 1,
                                        maxExpansions: 256,
                                    },
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
                .skip(Number(documentsToSkip))
                .project({
                    _id: { $toString: '$_id' },
                    username: 1,
                    firstname: 1,
                    lastname: 1,
                    count: 1,
                })
            if (limitOfDocuments) {
                query.limit(limitOfDocuments)
            }
            const result = await query

            return { result, count }
        } catch (err) {
            console.log(err)
        }
    }

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
