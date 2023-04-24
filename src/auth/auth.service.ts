import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/common/dto/schemas/user.schema'
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
        const encryptedPassword = await bcrypt.hash(password, user.hash)
        if (user) {
            if (await bcrypt.compare(user.password, encryptedPassword)) {
                return user
            }
            return null
        }
    }
    async login(user: any) {
        const payload = { username: user.username, sub: user.userId }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}

