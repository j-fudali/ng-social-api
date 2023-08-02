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
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { IsUserPostAuthorGuard } from './guards/is-user-post-author.guard'
import { PaginationParams } from 'src/common/dto/pagination-params'
import { PostEntity } from './entities/post.entity'
import { SearchDto } from 'src/comments/dto/search.dto'
import { MongoIdParamPipe } from 'src/common/pipes/mongo-id-param.pipe'

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @UseGuards(JwtStrategyGuard)
    @Post()
    async create(@Request() req, @Body() createPostDto: CreatePostDto) {
        return await this.postsService.create(req.user.userId, createPostDto)
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
    async upload(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Param('id', MongoIdParamPipe) id: string,
    ) {
        if (!id) {
            throw new BadRequestException('Post id not provided')
        }
        if (files.length === 0)
            throw new BadRequestException('Files not provided')
        return await this.postsService.uploadFiles(files, id)
    }
    @Get()
    async findAll(
        @Query() { skip, limit }: PaginationParams,
        @Body() body: SearchDto,
    ): Promise<{ result: PostEntity[]; count: number }> {
        return this.postsService.findAll(body.search, skip, limit)
    }

    @Get(':id')
    async findOne(
        @Param('id', MongoIdParamPipe) id: string,
    ): Promise<PostEntity> {
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
}
