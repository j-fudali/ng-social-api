import {
    ConflictException,
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
import { createHash } from 'crypto'
import * as fs from 'fs'
import { PostEntity } from './entities/post.entity'
@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
    ) {}
    async create(userId: string, createPostDto: CreatePostDto) {
        try {
            const post = new this.postModel({
                ...createPostDto,
                author: userId,
            })
            await post.save()
            return { postId: post.id, message: 'Post has been created' }
        } catch (error) {
            throw new UnprocessableEntityException('Cannot create new post')
        }
    }
    async findAll(
        search: string,
        skip = 0,
        limit = 4,
    ): Promise<{ result: PostEntity[]; count: number }> {
        try {
            const query = this.postModel.aggregate().search({
                index: 'posts_search',
                compound: {
                    should: [
                        {
                            autocomplete: {
                                path: 'title',
                                query: search,
                                tokenOrder: 'any',
                                fuzzy: {
                                    maxEdits: 2,
                                    prefixLength: 1,
                                    maxExpansions: 256,
                                },
                            },
                        },
                        {
                            autocomplete: {
                                path: 'text',
                                query: search,
                                tokenOrder: 'any',
                                fuzzy: {
                                    maxEdits: 2,
                                    prefixLength: 1,
                                    maxExpansions: 256,
                                },
                            },
                        },
                    ],
                },
            })
            const count = (await query).length
            const result = (
                await query
                    .skip(skip)
                    .limit(limit)
                    .lookup({
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author',
                    })
                    .unwind('$author')
                    .project({
                        title: 1,
                        text: 1,
                        files: 1,
                        author: 1,
                        createdAt: 1,
                    })
                    .exec()
            ).map((p) => new PostEntity(p))
            return { result, count }
        } catch (err) {
            console.log(err)
        }
    }
    async findOne(id: string): Promise<PostEntity> {
        const post = await this.postModel.findById(id).populate('author').lean()
        if (!post) throw new NotFoundException('Post not found')
        return new PostEntity(post)
    }
    async update(id: string, updatePostDto: UpdatePostDto) {
        const req = await this.postModel
            .findByIdAndUpdate(id, updatePostDto, { new: true })
            .populate('author')
            .lean()
        if (!req) throw new NotFoundException('Post not found')
        return { message: 'Post has been updated' }
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
    async uploadFiles(files: Array<Express.Multer.File>, documentId: string) {
        for (const file of files) {
            const buffer = file.buffer
            const checksum = createHash('sha256').update(buffer).digest('hex')
            const searchedFile = await this.postModel
                .find({
                    'files.hash': checksum,
                })
                .exec()
            if (searchedFile.find((f) => f.id === documentId))
                throw new ConflictException(
                    `${this.postModel.modelName} already has one or more provided files`,
                )
            if (!(searchedFile.length > 0)) {
                const filename = `${Date.now()}_${file.originalname}`
                const filesFolder = './files'
                const uploadFolder = `${filesFolder}/${filename}`
                const postFile: { url: string; hash: string } = {
                    url: uploadFolder,
                    hash: checksum,
                }
                const postToAddFiles = await this.postModel.findByIdAndUpdate(
                    documentId,
                    {
                        $push: { files: postFile },
                    },
                )
                if (!postToAddFiles) {
                    throw new NotFoundException(
                        `${this.postModel.modelName} not found`,
                    )
                }
                fs.writeFileSync(uploadFolder, buffer)
                continue
            }
            const foundedFile = searchedFile[0].files.find(
                (f) => f.hash === checksum,
            )
            try {
                await this.postModel.findByIdAndUpdate(documentId, {
                    $push: {
                        files: {
                            url: foundedFile.url,
                            hash: foundedFile.hash,
                        },
                    },
                })
            } catch (error) {
                throw new NotFoundException(
                    `${this.postModel.modelName} not found`,
                )
            }
        }
    }
}
