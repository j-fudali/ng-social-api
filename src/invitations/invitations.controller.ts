import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Request,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
} from '@nestjs/common'
import { InvitationsService } from './invitations.service'
import { ValidMongoObjectId } from 'src/common/dto/valid-mongo-objectId'
import { sendInvitationDto } from 'src/conversations/dto/send-invitation.dto'
import { ConversationInInvitation } from 'src/common/dto/conversation.entity'
import { IsParticipantGuard } from 'src/conversations/guards/is-participant.guard'
import { JwtStrategyGuard } from 'src/auth/guards/jwt-auth.guard'

@Controller('invitations')
@UseGuards(JwtStrategyGuard)
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) {}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async getInvitations(@Request() req) {
        return (
            await this.invitationsService.getAllInvitations(req.user.userId)
        ).map((c) => new ConversationInInvitation(c))
    }
    @Post(':id')
    @UseGuards(IsParticipantGuard)
    async sendInvitation(
        @Param() param: ValidMongoObjectId,
        @Body() body: sendInvitationDto,
    ) {
        return await this.invitationsService.sendInvitation(
            body.invitedUserId,
            param.id,
        )
    }
    @Post('accept/:id')
    acceptInvitation(@Request() req, @Param() param: ValidMongoObjectId) {
        return this.invitationsService.acceptInvitation(
            req.user.userId,
            param.id,
        )
    }

    @Post('decline/:id')
    async declineInvitation(
        @Request() req,
        @Param() param: ValidMongoObjectId,
    ) {
        return await this.invitationsService.declineInvitation(
            req.user.userId,
            param.id,
        )
    }

    @Post('leave/:id')
    @UseGuards(IsParticipantGuard)
    async leaveConversation(
        @Request() req,
        @Param() param: ValidMongoObjectId,
    ) {
        return await this.invitationsService.leaveConversation(
            req.user.userId,
            param.id,
        )
    }
}

