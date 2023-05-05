import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { createHash } from 'crypto'
import * as fs from 'fs'
import { InjectModel } from '@nestjs/mongoose'
import { Post } from 'src/common/schemas/post.schema'
import { Model } from 'mongoose'
import { Reaction } from 'src/common/schemas/reaction.schema'

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
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
        try {
            const req = await this.postModel
                .findByIdAndUpdate(id, updatePostDto, { new: true })
                .populate('author')
                .lean()
            if (!req) throw new NotFoundException('Post not found')
            return req
        } catch {
            throw new NotFoundException('Post not found')
        }
    }
    async remove(id: string) {
        const deletedPost = await this.postModel.findByIdAndDelete(id)
        if (!deletedPost) throw new NotFoundException('Post not found')
        await this.reactionModel.deleteMany({
            reactionFor: 'Post',
            reactionPlaceId: deletedPost.id,
        })
        return { message: 'Post has been deleted' }
    }
    async uploadFiles(files: Express.Multer.File[], postId: string) {
        for (const file of files) {
            const buffer = file.buffer
            const checksum = createHash('sha256').update(buffer).digest('hex')
            const searchedFile = await this.postModel
                .find({
                    'files.hash': checksum,
                })
                .exec()
            if (searchedFile.find((f) => f.id === postId))
                throw new ConflictException(
                    'Post already has one or more provided files',
                )
            if (!(searchedFile.length > 0)) {
                const filename = `${Date.now()}_${file.originalname}`
                const postsFilesFolder = './postsFiles'
                const uploadFolder = `${postsFilesFolder}/${filename}`
                const postFile: { url: string; hash: string } = {
                    url: uploadFolder,
                    hash: checksum,
                }
                const postToAddFiles = await this.postModel.findByIdAndUpdate(
                    postId,
                    {
                        $push: { files: postFile },
                    },
                )
                if (!postToAddFiles) {
                    throw new NotFoundException('Post not found')
                }
                fs.writeFileSync(uploadFolder, buffer)
                continue
            }
            const foundedFile = searchedFile[0].files.find(
                (f) => f.hash === checksum,
            )
            try {
                await this.postModel.findByIdAndUpdate(postId, {
                    $push: {
                        files: {
                            url: foundedFile.url,
                            hash: foundedFile.hash,
                        },
                    },
                })
            } catch (error) {
                throw new NotFoundException('Post not found')
            }
        }
    }
}
