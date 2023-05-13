import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Conversation } from 'src/common/schemas/conversation.schema'
import { Model } from 'mongoose'

@Injectable()
export class InvitationsService {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<Conversation>,
    ) {}
    async sendInvitation(invitedUser: string, conversationId: string) {
        const conversation = await this.conversationModel.findByIdAndUpdate(
            conversationId,
            { $addToSet: { invitedUsers: invitedUser } },
        )
        if (!conversation) throw new NotFoundException('Conversation not found')
        return { message: 'Invitation send to user' }
    }
    async getAllInvitations(userId: string) {
        return await this.conversationModel
            .find({
                invitedUsers: userId,
            })
            .populate(['creator'])
            .lean()
            .exec()
    }
    async acceptInvitation(userId: string, conversationId: string) {
        const conversation = await this.conversationModel.findById(
            conversationId,
        )
        if (!conversation) throw new NotFoundException('Conversation not found')
        if (conversation.invitedUsers.find((u) => u.toString() === userId)) {
            await conversation.updateOne({ $pull: { invitedUsers: userId } })
            await conversation.updateOne({ $push: { participants: userId } })
            return { message: 'Invitation accepted' }
        }
        throw new UnprocessableEntityException('Cannot accept invitation')
    }
    async declineInvitation(userId: string, conversationId: string) {
        const conversation = await this.conversationModel.findById(
            conversationId,
        )
        if (!conversation) throw new NotFoundException('Conversation not found')
        if (conversation.invitedUsers.find((u) => u.toString() === userId)) {
            await conversation.updateOne({ $pull: { invitedUsers: userId } })
            return { message: 'Invitation declined' }
        }
        throw new UnprocessableEntityException('Cannot decline invitation')
    }
    async leaveConversation(userId: string, conversationId: string) {
        const leftConversation = await this.conversationModel.findOne({
            _id: conversationId,
            participants: userId,
        })
        if (!leftConversation)
            throw new NotFoundException('Conversation not found')
        try {
            await leftConversation.updateOne({
                $pull: { participants: userId },
            })
            return { message: 'Conversation left' }
        } catch (error) {
            throw new UnprocessableEntityException(
                'Cannot left the conversation',
            )
        }
    }
}

