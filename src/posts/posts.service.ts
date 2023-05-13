import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Post } from 'src/common/schemas/post.schema'
import { Model } from 'mongoose'
import { Reaction } from 'src/common/schemas/reaction.schema'
import { Comment } from 'src/common/schemas/comment.schema'
import { FilesUploadService } from 'src/files-upload/files-upload.service'

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        private filesUploadService: FilesUploadService,
    ) {}
    async create(
        userId: string,
        createPostDto: CreatePostDto,
    ): Promise<string> {
        try {
            const post = new this.postModel({
                ...createPostDto,
                author: userId,
            })
            await post.save()
            return post.id
        } catch (error) {
            throw new UnprocessableEntityException()
        }
    }
    findAll() {
        return this.postModel.find().populate('author').lean().exec()
    }
    async findOne(id: string) {
        try {
            const post = await this.postModel
                .findById(id)
                .populate('author')
                .lean()
            if (!post) throw new NotFoundException('Post not found')
            return post
        } catch {
            throw new NotFoundException('Post not found')
        }
    }
    async update(id: string, updatePostDto: UpdatePostDto) {
        const req = await this.postModel
            .findByIdAndUpdate(id, updatePostDto, { new: true })
            .populate('author')
            .lean()
        if (!req) throw new NotFoundException('Post not found')
        return req
    }
    async remove(id: string) {
        const deletedPost = await this.postModel.findByIdAndDelete(id)
        if (!deletedPost) throw new NotFoundException('Post not found')
        await this.reactionModel.deleteMany({
            reactionFor: 'Post',
            reactionPlaceId: deletedPost.id,
        })
        await this.commentModel.deleteMany({
            post: deletedPost.id,
        })
        return { message: 'Post has been deleted' }
    }
    async uploadFiles(files: Express.Multer.File[], postId: string) {
        return this.filesUploadService.uploadFilesPosts(files, postId)
    }
}

