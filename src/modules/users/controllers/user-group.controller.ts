import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';

import { UserService } from '../services/user/user.service';
import { UserGroupService } from '../services/user-group/user-group.service';
import { InviteUserInput } from '../inputs/invite-user.input';
import { GetCurrentUserId } from 'src/common';
import { AtGuard } from '@common/guards';
import { IApiResponse } from '@common/types';
import { UserResponseDto } from '../dto/user-response.dto';
import { InviteResponseDto } from '../dto/invite-response.dto';

@Controller('user-groups')
export class UserGroupController {
    constructor(
        private readonly userService: UserService,
        private readonly userGroupService: UserGroupService
    ) { }

    @UseGuards(AtGuard)
    @Post('invite')
    @HttpCode(HttpStatus.OK)
    public async inviteUser(
        @Body() inviteInput: InviteUserInput,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<InviteResponseDto>> {
        const invite = await this.userGroupService.inviteUser(inviteInput, userId);
        const inviteDto = InviteResponseDto.fromEntity(invite);
        return {
            success: true,
            data: inviteDto
        };
    }

    @UseGuards(AtGuard)
    @Get('invites')
    @HttpCode(HttpStatus.OK)
    public async getInvites(
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<InviteResponseDto[]>> {
        const currentUser = await this.userService.getOneUser(userId);
        const invites = await this.userGroupService.getPendingInvitesByUsername(currentUser.username);
        const inviteDtos = invites.map(invite => InviteResponseDto.fromEntity(invite));
        return {
            success: true,
            data: inviteDtos
        };
    }

    @UseGuards(AtGuard)
    @Post('invites/:id/accept')
    @HttpCode(HttpStatus.OK)
    public async acceptInvite(
        @Param('id') inviteId: number,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<UserResponseDto>> {
        const group = await this.userGroupService.acceptInvite(inviteId, userId);
        const currentUser = await this.userService.getOneUser(userId);
        const userDto = UserResponseDto.fromEntity(currentUser);
        return {
            success: true,
            data: userDto
        };
    }
}
