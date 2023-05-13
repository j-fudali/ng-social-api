import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { UpdateConversationDto } from './dto/update-conversation.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Conversation } from 'src/common/schemas/conversation.schema'
import { Model } from 'mongoose'

@Injectable()
export class ConversationsService {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<Conversation>,
    ) {}
    async create(userId: string, createConversationDto: CreateConversationDto) {
        if (createConversationDto.participants.includes(userId))
            throw new BadRequestException(
                'Creator cannot be in participants array',
            )
        try {
            const conversation = new this.conversationModel({
                creator: userId,
                ...createConversationDto,
            })
            await conversation.save()
            return { message: 'Conversation created' }
        } catch (error) {
            new BadRequestException(
                'Cannot create conversation with provided data',
            )
        }
    }
    async findAllUserParticipate(userId: string) {
        return await this.conversationModel
            .find()
            .or([{ creator: userId }, { participants: userId }])
            .populate(['creator', 'participants', 'invitedUsers'])
            .lean()
            .exec()
    }

    // async findOne(id: string) {
    //     try {
    //         return await this.conversationModel.findById(id).lean().exec()
    //     } catch {
    //         throw new NotFoundException('Conversation not found')
    //     }
    // }

    async update(id: string, updateConversationDto: UpdateConversationDto) {
        const conversation = await this.conversationModel.findByIdAndUpdate(
            id,
            updateConversationDto,
        )
        if (!conversation) throw new NotFoundException('Conversation not found')
        return { message: 'Conversation updated' }
    }

    async remove(id: number) {
        const conversation = await this.conversationModel.findByIdAndDelete(id)
        if (!conversation) throw new NotFoundException('Conversation not found')
        return { message: 'Conversation deleted' }
    }
}

