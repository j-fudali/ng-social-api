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
import mongoose, { Model } from 'mongoose'
import { Reaction } from 'src/common/schemas/reaction.schema'
import { Comment } from 'src/common/schemas/comment.schema'
import { createHash } from 'crypto'
import * as fs from 'fs'
import { PostEntity } from './entities/post.entity'
import { CreateReactionDto } from 'src/reactions/dto/create-reaction.dto'
import { ReactionsService } from 'src/reactions/reactions.service'
import { UpdateReactionDto } from 'src/reactions/dto/update-reaction.dto'
import { ReactionEntity } from 'src/reactions/entities/reaction.entity'
@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        private reactionsService: ReactionsService,
    ) {}
    async create(userId: string, createPostDto: CreatePostDto) {
        try {
            const post = new this.postModel({
                ...createPostDto,
                author: userId,
            })
            await post.save()
            return new PostEntity(
                (await post.populate(['author', 'reactions'])).toJSON(),
            )
        } catch (error) {
            throw new UnprocessableEntityException('Cannot create new post')
        }
    }
    async findAllByGroup(groupId: string) {
        return await this.postModel.find({
            visibility: 'group',
            group: groupId,
        })
    }
    async findAllPrivate(userId: string) {
        return await this.postModel
            .find({ visibility: 'private', 'author._id': userId })
            .exec()
    }
    async search(
        search: string,
        page = 1,
        limit = 10,
        visibility: string,
        groupId?: string,
    ): Promise<{ result: PostEntity[]; count: number }> {
        try {
            let query = this.postModel
                .aggregate()
                .search({
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
                .match({ visibility: visibility })
            if (groupId) {
                query = query.match({ group: groupId })
            }
            query = query
                .lookup({
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                })
                .unwind('$author')
                .lookup({
                    from: 'reactions',
                    localField: 'reactions',
                    foreignField: '_id',
                    as: 'reactions',
                })
                .unwind({
                    path: '$reactions',
                    preserveNullAndEmptyArrays: true,
                })
                .lookup({
                    from: 'users',
                    localField: 'reactions.author',
                    foreignField: '_id',
                    as: 'reactions.author',
                })
                .unwind({
                    path: '$reactions.author',
                    preserveNullAndEmptyArrays: true,
                })
                .group({
                    _id: '$_id',
                    title: { $first: '$title' },
                    text: { $first: '$text' },
                    author: { $first: '$author' },
                    files: { $first: '$files' },
                    categories: { $first: '$categories' },
                    reactions: { $push: '$reactions' },
                })
                .sort({
                    _id: -1,
                })
            const count = (await query).length
            const result = (
                await query
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .exec()
            ).map(
                (p) =>
                    new PostEntity(
                        Object.keys(p.reactions[0]).length == 0
                            ? { ...p, reactions: [] }
                            : p,
                    ),
            )
            return { result, count }
        } catch {
            throw new UnprocessableEntityException(
                'Cannot search post by given input',
            )
        }
    }
    async findAllPublic(page = 1, limit = 10) {
        const result = (
            await this.postModel
                .find({ visibility: 'public' })
                .sort({ _id: -1 })
                .limit(limit)
                .skip((page - 1) * limit)
                .populate(['author', 'reactions'])
                .populate({
                    path: 'reactions',
                    populate: { path: 'author', model: 'User' },
                })
                .lean()
                .exec()
        ).map((p) => new PostEntity(p))
        const count = await this.postModel.count({ visibility: 'public' })
        return { result, count }
    }
    async findOne(id: string): Promise<PostEntity> {
        const post = await this.postModel
            .findById(id)
            .where({})
            .populate('author')
            .lean()
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
    async addReaction(
        userId: string,
        postId: string,
        createReactionDto: CreateReactionDto,
    ) {
        const post = await this.postModel.findById(postId).populate('reactions')
        if (post.reactions.length > 0)
            if (post.reactions.find((r) => r.author.toString() == userId))
                throw new ConflictException('Reaction already exists')
        const reaction = await this.reactionsService.create(
            userId,
            createReactionDto,
        )
        post.reactions.push(reaction)

        await post.save()
        return new ReactionEntity((await reaction.populate('author')).toJSON())
    }
    async uploadFiles(files: Array<Express.Multer.File>, documentId: string) {
        const urls: { url: string }[] = []
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
                urls.push({ url: postFile.url })
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
                urls.push({ url: foundedFile.url })
            } catch (error) {
                throw new NotFoundException(
                    `${this.postModel.modelName} not found`,
                )
            }
        }
        return urls
    }
}
