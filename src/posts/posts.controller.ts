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
import { IsUserPostAuthorGuard } from './guards/is-user-post-author.guard'

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
        @Param('id') id: string,
    ) {
        if (!id) {
            throw new BadRequestException('Post id not provided')
        }
        if (files.length === 0)
            throw new BadRequestException('Files not provided')
        return await this.postsService.uploadFiles(files, id)
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
    @UseGuards(JwtStrategyGuard, IsUserPostAuthorGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        if (!id) throw new BadRequestException('Post id is not provided')
        return new SinglePostEntity(
            await this.postsService.update(id, updatePostDto),
        )
    }
    @Delete(':id')
    @UseGuards(JwtStrategyGuard, IsUserPostAuthorGuard)
    async remove(@Param('id') id: string) {
        if (!id) throw new BadRequestException('No post id provided')
        return await this.postsService.remove(id)
    }
}
