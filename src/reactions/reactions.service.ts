import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common'
import { CreateReactionDto } from './dto/create-reaction.dto'
import { UpdateReactionDto } from './dto/update-reaction.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Reaction } from 'src/common/schemas/reaction.schema'
import { Model } from 'mongoose'
import { ReactionEntity } from './entities/reaction.entity'
@Injectable()
export class ReactionsService {
    constructor(
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
    ) {}
    async create(userId: string, createReactionDto: CreateReactionDto) {
        try {
            const reaction = await new this.reactionModel({
                ...createReactionDto,
                author: userId,
            }).save()
            return reaction
        } catch (err) {
            throw new UnprocessableEntityException('Cannot add new reaction')
        }
    }
    findAllRelatedByPost(id: string, page: number, limit: number) {
        return this.findAllRelated('Post', id, page, limit)
    }
    findAllRelatedByComment(id: string, page: number, limit: number) {
        return this.findAllRelated('Comment', id, page, limit)
    }
    private async findAllRelated(
        relatedTo: string,
        relatedToId: string,
        page = 1,
        limit = 4,
    ) {
        const reactions = this.reactionModel.find({
            reactionPlaceId: relatedToId,
            reactionFor: relatedTo,
        })

        const count = (
            await this.reactionModel.find({
                reactionPlaceId: relatedToId,
                reactionFor: relatedTo,
            })
        ).length
        const result = await reactions
            .populate('author')
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec()
        return { result, count }
    }
    async update(id: string, updateReactionDto: UpdateReactionDto) {
        const updatedReaction = await this.reactionModel.findByIdAndUpdate(
            id,
            updateReactionDto,
        )
        if (!updatedReaction) throw new NotFoundException('Reaction not found')
        return { message: 'Reaction changed' }
    }

    async remove(id: string) {
        const deletedReaction = await this.reactionModel.findByIdAndDelete(id)
        if (!deletedReaction) throw new NotFoundException('Reaction not found')
        return { message: 'Reaction deleted' }
    }
}
