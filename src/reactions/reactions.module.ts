import { Module } from '@nestjs/common'
import { ReactionsService } from './reactions.service'
import { ReactionsController } from './reactions.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Reaction, ReactionSchema } from 'src/common/schemas/reaction.schema'
import { Post, PostSchema } from 'src/common/schemas/post.schema'
import { Comment, CommentSchema } from 'src/common/schemas/comment.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Reaction.name, schema: ReactionSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
    ],
    controllers: [ReactionsController],
    providers: [ReactionsService],
})
export class ReactionsModule {}

