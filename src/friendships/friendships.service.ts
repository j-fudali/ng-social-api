import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { CreateFriendshipDto } from './dto/create-friendship.dto'
import { AcceptFriendshipDto } from './dto/accept-friendship.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Friendship } from 'src/common/schemas/friendship.schema'
import { Model } from 'mongoose'
import { RemoveFriendshipDto } from './dto/remove-friendship.dto'

@Injectable()
export class FriendshipsService {
    constructor(
        @InjectModel(Friendship.name)
        private friendshipModel: Model<Friendship>,
    ) {}
    async create(userId: string, createFriendshipDto: CreateFriendshipDto) {
        if (userId === createFriendshipDto.recipient)
            throw new BadRequestException('Cannot add yourself to friends')
        const countExisting = await this.friendshipModel
            .find()
            .or([
                { recipient: userId, requester: createFriendshipDto.recipient },
                { recipient: createFriendshipDto.recipient, requester: userId },
            ])
            .count()
        if (countExisting > 0)
            throw new ConflictException('Friendship already exists')
        try {
            const friendship = new this.friendshipModel({
                status: 'requested',
                recipient: createFriendshipDto.recipient,
                requester: userId,
            })
            const friendshipForRecipient = new this.friendshipModel({
                status: 'pending',
                recipient: createFriendshipDto.recipient,
                requester: userId,
            })
            await this.friendshipModel.insertMany([
                friendship,
                friendshipForRecipient,
            ])
            return { message: 'Friendship created' }
        } catch (error) {
            throw new InternalServerErrorException('Creating friendship error')
        }
    }

    async findByStatus(userId: string, status: string) {
        let friendships = null
        switch (status) {
            case 'requested':
                friendships = await this.friendshipModel
                    .find({
                        status,
                        requester: userId,
                    })
                    .populate(['recipient', 'requester'])
                    .lean()
                    .exec()
                break
            case 'pending':
                friendships = await this.friendshipModel
                    .find({
                        status,
                        recipient: userId,
                    })
                    .populate(['recipient', 'requester'])
                    .lean()
                    .exec()
                break
            case 'friends':
                friendships = await this.friendshipModel
                    .find({ status })
                    .populate(['recipient', 'requester'])
                    .lean()
                    .exec()
                break
            default:
                throw new BadRequestException('Invalid status provided')
        }
        return friendships
    }

    async acceptFriendship(
        userId: string,
        acceptFriendshipDto: AcceptFriendshipDto,
    ) {
        try {
            const deletedRequest = await this.friendshipModel.findOneAndDelete({
                recipient: userId,
                requester: acceptFriendshipDto.requester,
                status: 'requested',
            })
            if (!deletedRequest)
                throw new BadRequestException('Bad requester id')
        } catch (error) {
            throw error
        }
        await this.friendshipModel
            .findOneAndUpdate(
                {
                    recipient: userId,
                    requester: acceptFriendshipDto.requester,
                    status: 'pending',
                },
                {
                    status: 'friends',
                },
            )
            .populate(['recipient', 'requester'])
            .lean()
        return { message: 'Friendship accepted' }
    }

    async remove(userId: string, removeFriendshipDto: RemoveFriendshipDto) {
        const deletedFriendship = await this.friendshipModel.deleteMany().or([
            {
                recipient: userId,
                requester: removeFriendshipDto.secondUser,
            },
            {
                recipient: removeFriendshipDto.secondUser,
                requester: userId,
            },
        ])
        if (deletedFriendship.deletedCount === 0)
            throw new NotFoundException('Friendship not found')
        return { message: 'Friendship has been deleted' }
    }
}
