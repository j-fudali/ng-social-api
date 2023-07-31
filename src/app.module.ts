import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PostsModule } from './posts/posts.module'
import { APP_FILTER } from '@nestjs/core'
import { ReactionsModule } from './reactions/reactions.module'
import { MongooseErrorsFilter } from './common/filters/mongoose-errors.filter'
import { FriendshipsModule } from './friendships/friendships.module'
import { CommentsModule } from './comments/comments.module'
import { ConversationsModule } from './conversations/conversations.module'
import { MessagesModule } from './messages/messages.module'
import { InvitationsModule } from './invitations/invitations.module'
import { GroupsModule } from './groups/groups.module'

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: MongooseErrorsFilter,
        },
    ],
    imports: [
        GroupsModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.DB_URI, {
            dbName: 'ngSocial',
        }),
        AuthModule,
        UsersModule,
        PostsModule,
        ReactionsModule,
        FriendshipsModule,
        CommentsModule,
        ConversationsModule,
        MessagesModule,
        InvitationsModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
