import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
    UseGuards,
    Request,
    Query,
    Req,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { IsUserPostAuthorGuard } from './guards/is-user-post-author.guard'
import { PaginationParams } from 'src/common/dto/pagination-params.dto'
import { PostEntity } from './entities/post.entity'
import { MongoIdParamPipe } from 'src/common/pipes/mongo-id-param.pipe'
import { SearchPost } from './dto/search-post'
import { CreateReactionDto } from 'src/reactions/dto/create-reaction.dto'
import { IsUserReactionAuthorGuard } from 'src/reactions/guards/is-user-reaction-author.guard'
import { UpdateReactionDto } from 'src/reactions/dto/update-reaction.dto'

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @UseGuards(JwtStrategyGuard)
    async create(@Request() req, @Body() createPostDto: CreatePostDto) {
        return await this.postsService.create(req.user.userId, createPostDto)
    }
    @Get()
    findAllPublic(@Query() { page, limit }: PaginationParams) {
        return this.postsService.findAllPublic(page, limit)
    }
    @Get('search')
    search(
        @Query() { page, limit }: PaginationParams,
        @Query() { search, visibility, groupId }: SearchPost,
    ): Promise<{ result: PostEntity[]; count: number }> {
        return this.postsService.search(
            search,
            page,
            limit,
            visibility,
            groupId,
        )
    }
    @Get('me')
    findAllPrivate(@Request() req) {
        return this.postsService.findAllPrivate(req.user.userId)
    }
    @Get(':id')
    findOne(@Param('id', MongoIdParamPipe) id: string): Promise<PostEntity> {
        return this.postsService.findOne(id)
    }

    @Patch(':id')
    @UseGuards(JwtStrategyGuard, IsUserPostAuthorGuard)
    async update(
        @Param('id', MongoIdParamPipe) id: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        if (!id) throw new BadRequestException('Post id is not provided')
        return this.postsService.update(id, updatePostDto)
    }
    @Delete(':id')
    @UseGuards(JwtStrategyGuard, IsUserPostAuthorGuard)
    async remove(@Param('id', MongoIdParamPipe) id: string) {
        if (!id) throw new BadRequestException('No post id provided')
        return await this.postsService.remove(id)
    }
    @Post(':id/upload')
    @UseGuards(JwtStrategyGuard, IsUserPostAuthorGuard)
    @UseInterceptors(
        FilesInterceptor('files', null, {
            limits: {
                fieldSize: 5 * 1024 * 1024,
            },
        }),
    )
    upload(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Param('id', MongoIdParamPipe) id: string,
    ) {
        if (!id) {
            throw new BadRequestException('Post id not provided')
        }
        if (files.length === 0)
            throw new BadRequestException('Files not provided')
        return this.postsService.uploadFiles(files, id)
    }
    @Post(':id/reactions')
    @UseGuards(JwtStrategyGuard)
    addReaction(
        @Req() req,
        @Param('id', MongoIdParamPipe) id: string,
        @Body() createReactionDto: CreateReactionDto,
    ) {
        return this.postsService.addReaction(
            req.user.userId,
            id,
            createReactionDto,
        )
    }
}
