import { Module } from '@nestjs/common'
import { FriendshipsService } from './friendships.service'
import { FriendshipsController } from './friendships.controller'
import { MongooseModule } from '@nestjs/mongoose'
import {
    Friendship,
    FriendshipSchema,
} from 'src/common/schemas/friendship.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Friendship.name, schema: FriendshipSchema },
        ]),
    ],
    controllers: [FriendshipsController],
    providers: [FriendshipsService],
})
export class FriendshipsModule {}

