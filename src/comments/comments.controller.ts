import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    ParseFilePipeBuilder,
    Request,
    UseGuards,
    ClassSerializerInterceptor,
    Query,
    Req,
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { IsUserCommentAuthorGuard } from './guards/is-user-comment-author.guard'
import { MongoIdParamPipe } from 'src/common/pipes/mongo-id-param.pipe'
import { CreateReactionDto } from 'src/reactions/dto/create-reaction.dto'
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
    getCommentsRelatedToPost(
        @Query('postId', MongoIdParamPipe) postId: string,
    ) {
        return this.commentsService.findAllRelatedToPost(postId)
    }

    @Patch(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtStrategyGuard, IsUserCommentAuthorGuard)
    update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentsService.update(id, updateCommentDto)
    }

    @Delete(':id')
    @UseGuards(JwtStrategyGuard, IsUserCommentAuthorGuard)
    remove(@Param('id') id: string) {
        return this.commentsService.remove(id)
    }

    @Post(':id/upload')
    @UseGuards(JwtStrategyGuard, IsUserCommentAuthorGuard)
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

    @Post(':id/reactions')
    @UseGuards(JwtStrategyGuard)
    addReaction(
        @Req() req,
        @Param('id', MongoIdParamPipe) id: string,
        @Body() createReactionDto: CreateReactionDto,
    ) {
        return this.commentsService.addReaction(
            req.user.userId,
            id,
            createReactionDto,
        )
    }
}
