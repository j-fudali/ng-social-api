import {
    Controller,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common'
import { ReactionsService } from './reactions.service'
import { UpdateReactionDto } from './dto/update-reaction.dto'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'
import { IsUserReactionAuthorGuard } from './guards/is-user-reaction-author.guard'
import { MongoIdParamPipe } from 'src/common/pipes/mongo-id-param.pipe'

@Controller('reactions')
export class ReactionsController {
    constructor(private readonly reactionsService: ReactionsService) {}
    @Patch(':id')
    @UseGuards(JwtStrategyGuard, IsUserReactionAuthorGuard)
    updateReactionOfPost(
        @Param('id', MongoIdParamPipe) id: string,
        @Body() updateReactionDto: UpdateReactionDto,
    ) {
        return this.reactionsService.update(id, updateReactionDto)
    }

    @Delete(':id')
    @UseGuards(JwtStrategyGuard, IsUserReactionAuthorGuard)
    remove(@Param('id') id: string) {
        return this.reactionsService.remove(id)
    }
}
