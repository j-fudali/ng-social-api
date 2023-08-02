import {
    Controller,
    Get,
    UseGuards,
    Request,
    Patch,
    Delete,
    Body,
    Query,
    NotFoundException,
} from '@nestjs/common'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { PaginationParams } from 'src/common/dto/pagination-params'

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    getVisibleUsers(
        @Query() { skip, limit }: PaginationParams,
        @Body('search') search: string,
    ): Promise<{ result: UserEntity[]; count: number }> {
        return this.usersService.getVisibleUsers(search, skip, limit)
    }

    @Get('profile')
    @UseGuards(JwtStrategyGuard)
    getUser(@Request() req): Promise<UserEntity> {
        return this.usersService.getUser(req.user.username)
    }
    @Patch('profile/update')
    @UseGuards(JwtStrategyGuard)
    async updateUser(@Request() req, @Body() body: UpdateUserDto) {
        if (!req.user.userId)
            throw new NotFoundException('Cannot find user profile')
        return new UserEntity(
            await this.usersService.updateUser(req.user.userId, body),
        )
    }
    @Delete('profile/delete')
    @UseGuards(JwtStrategyGuard)
    async deleteUser(@Request() req) {
        if (!req.user.userId)
            throw new NotFoundException('Cannot find user profile')
        return await this.usersService.deleteUser(req.user.userId)
    }
}
