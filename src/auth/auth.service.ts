import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/common/schemas/user.schema'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcrypt'
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
        const user = await this.usersService.getUser(username)
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                return user
            }
            return null
        }
    }
    login(user: any) {
        const payload = { username: user.username, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
    register(userData: any) {
        this.usersService.createUser(userData)
    }
}

