import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/common/schemas/user.schema'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(
        username: string,
        password: string,
    ): Promise<User | null> {
        const user = await this.usersService.getUserProfile(username)
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                return user
            }
            return null
        }
    }
    login(user: any) {
        const payload = { username: user.username, sub: user._id.toString() }
        return {
            accessToken: this.jwtService.sign(payload),
            userId: payload.sub,
        }
    }
    async register(userData: CreateUserDto) {
        const user = await this.usersService.createUser(userData)
        const token = this.login(user)
        return { message: 'User has been created', ...token }
    }
}
