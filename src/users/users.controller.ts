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
    Param,
} from '@nestjs/common'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { PaginationParams } from 'src/common/dto/pagination-params.dto'
import { SearchParam } from 'src/common/dto/search-param.dto'

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    getVisibleUsers(
        @Query() { page, limit }: PaginationParams,
        @Query() { search }: SearchParam,
    ): Promise<{ result: UserEntity[]; count: number }> {
        return this.usersService.getVisibleUsers(search, page, limit)
    }
    @Get('byUsername/:username')
    getUserByUsername(@Param('username') username: string) {
        return this.usersService.getUserByUsername(username)
    }
    @Get('byEmail/:email')
    getUserByEmail(@Param('email') email: string) {
        return this.usersService.getUserByEmail(email)
    }
    @Get('profile')
    @UseGuards(JwtStrategyGuard)
    getUser(@Request() req): Promise<UserEntity> {
        return this.usersService.getUserProfile(req.user.username)
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
