import { Module } from '@nestjs/common'
import { ReactionsService } from './reactions.service'
import { ReactionsController } from './reactions.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Reaction, ReactionSchema } from 'src/common/schemas/reaction.schema'
import { Post, PostSchema } from 'src/common/schemas/post.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Reaction.name, schema: ReactionSchema },
        ]),
    ],
    controllers: [ReactionsController],
    providers: [ReactionsService],
})
export class ReactionsModule {}

