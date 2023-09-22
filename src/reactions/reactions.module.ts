import { Module } from '@nestjs/common'
import { ReactionsService } from './reactions.service'
import { ReactionsController } from './reactions.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Reaction, ReactionSchema } from 'src/common/schemas/reaction.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Reaction.name, schema: ReactionSchema },
        ]),
    ],
    controllers: [ReactionsController],
    providers: [ReactionsService],
    exports: [ReactionsService],
})
export class ReactionsModule {}
