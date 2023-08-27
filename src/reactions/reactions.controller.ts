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
    Query,
} from '@nestjs/common'
import { ReactionsService } from './reactions.service'
import { CreateReactionDto } from './dto/create-reaction.dto'
import { UpdateReactionDto } from './dto/update-reaction.dto'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { ReactionEntity } from './entities/reaction.entity'
import { GetRelatedReactions } from './dto/get-related-reactions.dto'
import { IsUserReactionAuthorGuard } from './guards/is-user-reaction-author.guard'
import { PaginationParams } from 'src/common/dto/pagination-params.dto'
import { MongoIdParamPipe } from 'src/common/pipes/mongo-id-param.pipe'

@Controller('reactions')
export class ReactionsController {
    constructor(private readonly reactionsService: ReactionsService) {}
    @Post()
    @UseGuards(JwtStrategyGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    create(@Request() req, @Body() createReactionDto: CreateReactionDto) {
        return this.reactionsService.create(req.user.userId, createReactionDto)
    }

    @Get('posts/:postId')
    @UseInterceptors(ClassSerializerInterceptor)
    async findAllByPost(
        @Param('postId', MongoIdParamPipe) postId: string,
        @Query() { page, limit }: PaginationParams,
    ) {
        this.reactionsService.findAllRelatedByPost(postId, page, limit)
    }
    @Get('posts/:postId/comments/:commentId')
    @UseInterceptors(ClassSerializerInterceptor)
    async findAllByComment(
        @Param('commentId', MongoIdParamPipe) commentId: string,
        @Query() { page, limit }: PaginationParams,
    ) {
        this.reactionsService.findAllRelatedByComment(commentId, page, limit)
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
