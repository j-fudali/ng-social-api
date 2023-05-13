import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from 'src/common/schemas/post.schema'
import { Message, MessageSchema } from 'src/common/schemas/message.schema'
import { FilesUploadService } from './files-upload.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
        MulterModule.register({
            storage: memoryStorage(),
        }),
    ],
    providers: [FilesUploadService],
    exports: [FilesUploadService],
})
export class FilesUploadModule {}
