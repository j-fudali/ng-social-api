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
    UploadedFile,
    ParseFilePipeBuilder,
    Request,
    UseGuards,
    ClassSerializerInterceptor,
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { IsUserAuthorGuard } from 'src/common/guards/is-user-author.guard'
import { GetCommentsRelatedToPostDto } from './dto/get-comments-related-to-post.dto'
import { CommentEntity, SingleCommentEntity } from './entities/comment.entity'
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    @UseGuards(JwtStrategyGuard)
    create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
        return this.commentsService.create(req.user.userId, createCommentDto)
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async getCommentsRelatedToPost(
        @Body() getCommentsRelatedToPost: GetCommentsRelatedToPostDto,
    ) {
        return (
            await this.commentsService.findAllRelatedToPost(
                getCommentsRelatedToPost.postId,
            )
        ).map((comment) => new CommentEntity(comment))
    }

    @Patch(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtStrategyGuard, IsUserAuthorGuard)
    async update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return new SingleCommentEntity(
            await this.commentsService.update(id, updateCommentDto),
        )
    }

    @Delete(':id')
    @UseGuards(JwtStrategyGuard, IsUserAuthorGuard)
    remove(@Param('id') id: string) {
        return this.commentsService.remove(id)
    }

    @Post(':id/upload')
    @UseGuards(JwtStrategyGuard, IsUserAuthorGuard)
    @UseInterceptors(FileInterceptor('image'))
    uploadImages(
        @Param('id') id: string,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'image/*',
                })
                .addMaxSizeValidator({
                    maxSize: 1024 * 1024 * 5,
                })
                .build(),
        )
        image: Express.Multer.File,
    ) {
        return this.commentsService.uploadImage(image, id)
    }
}

