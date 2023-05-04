import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PostsModule } from './posts/posts.module'
import { APP_FILTER } from '@nestjs/core'
import { MongooseErrorsFilter } from './shared/filters/mongoose-errors.filter'

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
    ],
    controllers: [AppController],
})
export class AppModule {}

