import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    Request,
    UseGuards,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common'
import { FriendshipsService } from './friendships.service'
import { CreateFriendshipDto } from './dto/create-friendship.dto'
import { AcceptFriendshipDto } from './dto/accept-friendship.dto'
import { RemoveFriendshipDto } from './dto/remove-friendship.dto'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { FriendshipEntity } from './entities/friendship.entity'

@Controller('friendships')
@UseGuards(JwtStrategyGuard)
export class FriendshipsController {
    constructor(private readonly friendshipsService: FriendshipsService) {}

    @Post()
    create(@Request() req, @Body() createFriendshipDto: CreateFriendshipDto) {
        return this.friendshipsService.create(
            req.user.userId,
            createFriendshipDto,
        )
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Request() req, @Query('status') status: string) {
        return (
            await this.friendshipsService.findByStatus(req.user.userId, status)
        ).map((friendship) => new FriendshipEntity(friendship))
    }

    @Patch()
    acceptFriendship(
        @Request() req,
        @Body() updateFriendshipDto: AcceptFriendshipDto,
    ) {
        return this.friendshipsService.acceptFriendship(
            req.user.userId,
            updateFriendshipDto,
        )
    }

    @Delete()
    remove(@Request() req, @Query() params: RemoveFriendshipDto) {
        return this.friendshipsService.remove(req.user.userId, params)
    }
}
