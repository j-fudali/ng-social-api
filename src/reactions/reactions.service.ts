import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { CreateReactionDto } from './dto/create-reaction.dto'
import { UpdateReactionDto } from './dto/update-reaction.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Reaction } from 'src/common/schemas/reaction.schema'
import { Model } from 'mongoose'
import { Post } from 'src/common/schemas/post.schema'
@Injectable()
export class ReactionsService {
    constructor(
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
        @InjectModel(Post.name) private postModel: Model<Post>, //Inject message model
    ) {}
    async create(userId: string, createReactionDto: CreateReactionDto) {
        switch (createReactionDto.reactionFor) {
            case 'Post':
                const req = await this.postModel.findByIdAndUpdate(
                    createReactionDto.reactionPlaceId,
                    createReactionDto.reaction === 'like'
                        ? { $inc: { 'reactionsNumber.likesNumber': 1 } }
                        : { $inc: { 'reactionsNumber.dislikesNumber': 1 } },
                )
                if (!req) throw new NotFoundException('Post not found')
                break
            case 'Comment':
                // await this.commentMode.....
                break
            default:
                throw new BadRequestException('Invalid reaction for field')
        }
        const reaction = new this.reactionModel({
            ...createReactionDto,
            author: userId,
        })
        await reaction.save()

        return { message: 'Reaction added' }
    }

    async findAllRelatedReactions(relatedTo: string, id: string) {
        const reaction = await this.reactionModel
            .find({
                reactionPlaceId: id,
                reactionFor: relatedTo,
            })
            .populate('author')
            .lean()
            .exec()
        return reaction
    }

    async update(id: string, updateReactionDto: UpdateReactionDto) {
        try {
            const reaction = await this.reactionModel.findByIdAndUpdate(
                id,
                updateReactionDto,
            )
            if (reaction.reactionFor == 'Post') {
                await this.postModel.findByIdAndUpdate(
                    reaction.reactionPlaceId,
                    updateReactionDto.reaction == 'like'
                        ? {
                              $inc: {
                                  'reactionsNumber.likesNumber': 1,
                                  'reactionsNumber.dislikesNumber': -1,
                              },
                          }
                        : {
                              $inc: {
                                  'reactionsNumber.likesNumber': -1,
                                  'reactionsNumber.dislikesNumber': 1,
                              },
                          },
                )
            }
            if (reaction.reactionFor === 'Comment') {
                //Comment implementation
            }
            return { message: 'Reaction changed' }
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async remove(id: string) {
        try {
            const deletedReaction = await this.reactionModel.findByIdAndDelete(
                id,
            )
            if (deletedReaction.reactionFor === 'Post') {
                await this.postModel.findByIdAndUpdate(
                    deletedReaction.reactionPlaceId,
                    deletedReaction.reaction === 'like'
                        ? { $inc: { 'reactionsNumber.likesNumber': -1 } }
                        : { $inc: { 'reactionsNumber.dislikesNumber': -1 } },
                )
            }
            if (deletedReaction.reactionFor === 'Comment') {
                //Comment implementation
            }
            return { message: 'Reaction deleted' }
        } catch (error) {
            throw new BadRequestException()
        }
    }
}

