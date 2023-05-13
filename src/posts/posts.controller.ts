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
    ClassSerializerInterceptor,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { PostEntity, SinglePostEntity } from './entities/post.entity'
import { IsUserAuthorGuard } from '../common/guards/is-user-author.guard'

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @UseGuards(JwtStrategyGuard)
    @Post()
    async create(@Request() req, @Body() createPostDto: CreatePostDto) {
        const postId = await this.postsService.create(
            req.user.userId,
            createPostDto,
        )
        return { postId: postId }
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll() {
        return (await this.postsService.findAll()).map((post) => {
            return new PostEntity(post)
        })
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id') id: string) {
        return new SinglePostEntity(await this.postsService.findOne(id))
    }

    @Patch(':id')
    @UseGuards(JwtStrategyGuard, IsUserAuthorGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        if (!id) throw new BadRequestException('No post id provided')
        return new SinglePostEntity(
            await this.postsService.update(id, updatePostDto),
        )
    }
    @Delete(':id')
    @UseGuards(JwtStrategyGuard, IsUserAuthorGuard)
    remove(@Param('id') id: string) {
        if (!id) throw new BadRequestException('No post id provided')
        return this.postsService.remove(id)
    }
    @UseGuards(JwtStrategyGuard, IsUserAuthorGuard)
    @UseInterceptors(
        FilesInterceptor('files', null, {
            limits: {
                fieldSize: 5 * 1024 * 1024,
            },
        }),
    )
    @Post(':id/upload')
    uploadFiles(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Param('id') id: string,
    ) {
        if (!id) {
            throw new BadRequestException('Post id not provided')
        }
        if (files.length === 0)
            throw new BadRequestException('Files not provided')
        return this.postsService.uploadFiles(files, id)
    }
}
