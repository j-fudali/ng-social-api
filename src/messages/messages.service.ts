import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message } from 'src/common/schemas/message.schema'
import { createHash } from 'crypto'
import * as fs from 'fs'
@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
    ) {}
    async create(userId: string, createMessageDto: CreateMessageDto) {
        try {
            const message = new this.messageModel({
                author: userId,
                ...createMessageDto,
            })
            await message.save()
            return { message: 'Message send', messageId: message._id }
        } catch (error) {
            throw new BadRequestException('Cannot send a message')
        }
    }

    async findAllInConversation(conversationId: string) {
        return await this.messageModel
            .find({ conversation: conversationId })
            .populate('author')
            .lean()
            .exec()
    }
    async remove(id: string) {
        const deletedMessage = await this.messageModel.findByIdAndDelete(id)
        if (!deletedMessage) throw new NotFoundException('Message not found')
        return { message: 'Message has been deleted' }
    }

    async uploadFiles(files: Express.Multer.File[], documentId: string) {
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
