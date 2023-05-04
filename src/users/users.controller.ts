import {
    Controller,
    Get,
    UseGuards,
    Request,
    Patch,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
    Body,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    @UseGuards(JwtStrategyGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('profile')
    async getUser(@Request() req) {
        const user = (
            await this.usersService.getUser(req.user.username)
        ).toObject()
        return new UserEntity(user)
    }
    @UseGuards(JwtStrategyGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('profile/update')
    async updateUser(@Request() req, @Body() body: UpdateUserDto) {
        if (!req.user.userId || !body) throw new BadRequestException()
        return new UserEntity(
            await this.usersService.updateUser(req.user.userId, body),
        )
    }
    @UseGuards(JwtStrategyGuard)
    @Delete('profile/delete')
    async deleteUser(@Request() req) {
        if (req.user.userId) throw new BadRequestException()
        await this.usersService.deleteUser(req.user.userId)
        return { message: 'User has been deleted' }
    }
}

