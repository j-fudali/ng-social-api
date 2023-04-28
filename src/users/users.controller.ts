import {
    Controller,
    Get,
    UseGuards,
    Request,
    Patch,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    @UseGuards(JwtStrategyGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('profile')
    async getUser(@Request() req) {
        const user = await this.usersService.getUser(req.user.username)
        return {
            id: user.id,
            ...new UserEntity({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                birthdate: user.birthdate,
                phone: user.phone,
            }),
        }
    }
    @UseGuards(JwtStrategyGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('profile/update')
    async updateUser(@Request() req) {
        await this.usersService.updateUser(req.user.userId, req.body.userData)
    }
    @UseGuards(JwtStrategyGuard)
    @Delete('profile/delete')
    deleteUser(@Request() req) {
        return this.usersService.deleteUser(req.user.userId)
    }
}

