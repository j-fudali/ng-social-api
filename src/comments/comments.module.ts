import { Module } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Comment, CommentSchema } from 'src/common/schemas/comment.schema'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { Post, PostSchema } from 'src/common/schemas/post.schema'
import { Reaction, ReactionSchema } from 'src/common/schemas/reaction.schema'

@Module({
    imports: [
        MulterModule.register({ storage: memoryStorage() }),
        MongooseModule.forFeature([
            { name: Comment.name, schema: CommentSchema },
            { name: Post.name, schema: PostSchema },
            { name: Reaction.name, schema: ReactionSchema },
        ]),
    ],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule {}

