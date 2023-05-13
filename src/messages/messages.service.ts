import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Message } from 'src/common/schemas/message.schema'
import { Model } from 'mongoose'
import { FilesUploadService } from 'src/files-upload/files-upload.service'

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
        private filesUploadService: FilesUploadService,
    ) {}
    async create(userId: string, createMessageDto: CreateMessageDto) {
        try {
            const message = new this.messageModel({
                author: userId,
                ...createMessageDto,
            })
            await message.save()
            return { message: 'Message send' }
        } catch (error) {}
    }

    async findAll(conversationId: string) {
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
    uploadFiles(files: Express.Multer.File[], messageId: string) {
        return this.filesUploadService.uploadFilesMessages(files, messageId)
    }
}
