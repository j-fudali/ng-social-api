import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from 'src/common/schemas/post.schema'

@Module({
    imports: [
        MulterModule.register({
            storage: memoryStorage(),
        }),
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}

