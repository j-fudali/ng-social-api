import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { createHash } from 'crypto'
import { Model } from 'mongoose'
import { Message } from 'src/common/schemas/message.schema'
import { Post } from 'src/common/schemas/post.schema'
import * as fs from 'fs'
@Injectable()
export class FilesUploadService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Message.name) private messageModel: Model<Message>,
    ) {}
    async uploadFilesPosts(files: Express.Multer.File[], documentId: string) {
        for (const file of files) {
            const buffer = file.buffer
            const checksum = createHash('sha256').update(buffer).digest('hex')
            const searchedFile = await this.postModel
                .find({
                    'files.hash': checksum,
                })
                .exec()
            if (searchedFile.find((f) => f.id === documentId))
                throw new ConflictException(
                    `${this.postModel.modelName} already has one or more provided files`,
                )
            if (!(searchedFile.length > 0)) {
                const filename = `${Date.now()}_${file.originalname}`
                const filesFolder = './files'
                const uploadFolder = `${filesFolder}/${filename}`
                const postFile: { url: string; hash: string } = {
                    url: uploadFolder,
                    hash: checksum,
                }
                const postToAddFiles = await this.postModel.findByIdAndUpdate(
                    documentId,
                    {
                        $push: { files: postFile },
                    },
                )
                if (!postToAddFiles) {
                    throw new NotFoundException(
                        `${this.postModel.modelName} not found`,
                    )
                }
                fs.writeFileSync(uploadFolder, buffer)
                continue
            }
            const foundedFile = searchedFile[0].files.find(
                (f) => f.hash === checksum,
            )
            try {
                await this.postModel.findByIdAndUpdate(documentId, {
                    $push: {
                        files: {
                            url: foundedFile.url,
                            hash: foundedFile.hash,
                        },
                    },
                })
            } catch (error) {
                throw new NotFoundException(
                    `${this.postModel.modelName} not found`,
                )
            }
        }
    }
    async uploadFilesMessages(
        files: Express.Multer.File[],
        documentId: string,
    ) {
        for (const file of files) {
            const buffer = file.buffer
            const checksum = createHash('sha256').update(buffer).digest('hex')
            const searchedFile = await this.messageModel
                .find({
                    'files.hash': checksum,
                })
                .exec()
            if (searchedFile.find((f) => f.id === documentId))
                throw new ConflictException(
                    `Message already has one or more provided files`,
                )
            if (!(searchedFile.length > 0)) {
                const filename = `${Date.now()}_${file.originalname}`
                const filesFolder = './files'
                const uploadFolder = `${filesFolder}/${filename}`
                const messageFile: { url: string; hash: string } = {
                    url: uploadFolder,
                    hash: checksum,
                }
                const messageToAddFiles =
                    await this.messageModel.findByIdAndUpdate(documentId, {
                        $push: { files: messageFile },
                    })
                if (!messageToAddFiles) {
                    throw new NotFoundException(`Message not found`)
                }
                fs.writeFileSync(uploadFolder, buffer)
                continue
            }
            const foundedFile = searchedFile[0].files.find(
                (f) => f.hash === checksum,
            )
            try {
                await this.messageModel.findByIdAndUpdate(documentId, {
                    $push: {
                        files: {
                            url: foundedFile.url,
                            hash: foundedFile.hash,
                        },
                    },
                })
            } catch (error) {
                throw new NotFoundException(`Message not found`)
            }
        }
    }
}
