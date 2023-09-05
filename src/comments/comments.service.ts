import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Comment } from 'src/common/schemas/comment.schema'
import { Model } from 'mongoose'
import { Post } from 'src/common/schemas/post.schema'
import { createHash } from 'crypto'
import * as fs from 'fs'
import { Reaction } from 'src/common/schemas/reaction.schema'
import { CommentEntity, SingleCommentEntity } from './entities/comment.entity'
@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
    ) {}
    async create(userId: string, createCommentDto: CreateCommentDto) {
        const post = await this.postModel.findById(createCommentDto.post)
        if (!post) throw new NotFoundException("Referenced post doesn't exist")
        try {
            const req = new this.commentModel({
                author: userId,
                ...createCommentDto,
            })
            const comment = await req.save()
            return { message: 'Comment created', commentId: comment.id }
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async findAllRelatedToPost(postId: string) {
        try {
            const req = await this.commentModel
                .find({ post: postId })
                .populate('author')
                .lean()
                .exec()
            return req.map((c) => new CommentEntity(c))
        } catch (error) {
            throw new BadRequestException('Bad data provided')
        }
    }

    async update(id: string, updateCommentDto: UpdateCommentDto) {
        const req = await this.commentModel
            .findByIdAndUpdate(id, updateCommentDto, { new: true })
            .populate('author')
            .lean()
        if (!req) throw new NotFoundException('Comment not found')
        return new SingleCommentEntity(req)
    }

    async remove(id: string) {
        const deletedComment = await this.commentModel.findByIdAndDelete(id)
        if (!deletedComment) throw new NotFoundException('Comment not found')
        await this.reactionModel.deleteMany({
            reactionFor: 'Comment',
            reactionPlaceId: deletedComment.id,
        })
        return { message: 'Comment deleted' }
    }
    async uploadImage(image: Express.Multer.File, commentId: string) {
        const buffer = image.buffer
        const checksum = createHash('sha256').update(buffer).digest('hex')
        const searchedImage = await this.commentModel
            .find({
                'image.hash': checksum,
            })
            .exec()
        if (searchedImage.find((c) => c.id === commentId))
            throw new ConflictException('Comment already has this image')
        if (!(searchedImage.length > 0)) {
            const filename = `${Date.now()}_${image.originalname}`
            const commentsImagesFolder = './commentsImages'
            const uploadFolder = `${commentsImagesFolder}/${filename}`
            const imageFile: { url: string; hash: string } = {
                url: uploadFolder,
                hash: checksum,
            }
            const commentToAddImage = await this.commentModel.findByIdAndUpdate(
                commentId,
                {
                    $set: { image: imageFile },
                },
            )
            if (!commentToAddImage) {
                throw new NotFoundException('Comment not found')
            }
            fs.writeFileSync(uploadFolder, buffer)
            return { message: 'Image added to comment' }
        }
        const foundedImage = searchedImage[0].image
        try {
            await this.commentModel.findByIdAndUpdate(commentId, {
                $set: {
                    image: {
                        url: foundedImage.url,
                        hash: foundedImage.hash,
                    },
                },
            })
            return { message: 'Image added to comment' }
        } catch (error) {
            throw new NotFoundException('Comment not found')
        }
    }
}
