import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from 'src/common/schemas/post.schema'
import { Reaction, ReactionSchema } from 'src/common/schemas/reaction.schema'
import { Comment, CommentSchema } from 'src/common/schemas/comment.schema'
import { ReactionsModule } from 'src/reactions/reactions.module'

@Module({
    imports: [
        MulterModule.register({
            storage: memoryStorage(),
        }),
        MongooseModule.forFeature([
            { name: Reaction.name, schema: ReactionSchema },
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
        ReactionsModule,
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
