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
    UseFilters,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { PostEntity, SinglePostEntity } from './entities/post.entity'
import { MongooseErrorsFilter } from 'src/shared/filters/mongoose-errors.filter'

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

    @UseGuards(JwtStrategyGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        if (!id) throw new BadRequestException('No post id provided')
        return new SinglePostEntity(
            await this.postsService.update(id, updatePostDto),
        )
    }
    @UseGuards(JwtStrategyGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        if (!id) throw new BadRequestException('No post id provided')
        return this.postsService.remove(id)
    }
    @UseGuards(JwtStrategyGuard)
    @UseInterceptors(
        FilesInterceptor('files', null, {
            limits: {
                fieldSize: 5 * 1024 * 1024,
            },
        }),
    )
    @Post('upload')
    uploadFiles(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: { postId: string },
    ) {
        if (!body.postId) {
            throw new BadRequestException('Post id not provided')
        }
        return this.postsService.uploadFiles(files, body.postId)
    }
}

