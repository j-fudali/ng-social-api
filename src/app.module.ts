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

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: MongooseErrorsFilter,
        },
    ],
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.DB_URI, {
            dbName: 'ngSocial',
        }),
        AuthModule,
        UsersModule,
        PostsModule,
        ReactionsModule,
        FriendshipsModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
