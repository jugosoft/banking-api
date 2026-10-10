import { UserGroupInviteEntity } from '@entities';
import { UserResponseDto } from './user-response.dto';

export class InviteResponseDto {
    readonly id: number;
    readonly groupId: number;
    readonly inviter: UserResponseDto;
    readonly inviteeUsername: string;
    readonly createdAt: Date;

    private constructor(
        id: number,
        groupId: number,
        inviter: UserResponseDto,
        inviteeUsername: string,
        createdAt: Date
    ) {
        this.id = id;
        this.groupId = groupId;
        this.inviter = inviter;
        this.inviteeUsername = inviteeUsername;
        this.createdAt = createdAt;
    }

    static fromEntity(invite: UserGroupInviteEntity): InviteResponseDto {
        return new InviteResponseDto(
            invite.id,
            invite.groupId,
            UserResponseDto.fromEntity(invite.inviter!),
            invite.inviteeUsername,
            invite.createdAt
        );
    }
}
