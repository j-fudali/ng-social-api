import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/common/schemas/user.schema'
import { UsersController } from './users.controller'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [UsersService],
    exports: [UsersService, MongooseModule],
    controllers: [UsersController],
})
export class UsersModule {}
