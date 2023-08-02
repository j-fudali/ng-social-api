import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common'
import { ReactionsService } from './reactions.service'
import { CreateReactionDto } from './dto/create-reaction.dto'
import { UpdateReactionDto } from './dto/update-reaction.dto'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { ReactionEntity } from './entities/reaction.entity'
import { GetRelatedReactions } from './dto/get-related-reactions.dto'
import { IsUserReactionAuthorGuard } from './guards/is-user-reaction-author.guard'

@Controller('reactions')
export class ReactionsController {
    constructor(private readonly reactionsService: ReactionsService) {}
    @Post()
    @UseGuards(JwtStrategyGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    create(@Request() req, @Body() createReactionDto: CreateReactionDto) {
        return this.reactionsService.create(req.user.userId, createReactionDto)
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAllRelatedReactions(
        @Body() getRelatedReactions: GetRelatedReactions,
    ) {
        return (
            await this.reactionsService.findAllRelatedReactions(
                getRelatedReactions.relatedTo,
                getRelatedReactions.relatedPlaceId,
            )
        ).map((reaction) => new ReactionEntity(reaction))
    }
    @Patch(':id')
    @UseGuards(JwtStrategyGuard, IsUserReactionAuthorGuard)
    update(
        @Param('id') id: string,
        @Body() updateReactionDto: UpdateReactionDto,
    ) {
        return this.reactionsService.update(id, updateReactionDto)
    }

    @Delete(':id')
    @UseGuards(JwtStrategyGuard, IsUserReactionAuthorGuard)
    remove(@Param('id') id: string) {
        return this.reactionsService.remove(id)
    }
}
