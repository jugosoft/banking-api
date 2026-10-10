import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/entities/user.entity';
import { UserGroupEntity } from 'src/entities/deposit-user-group.entity';
import { UserGroupInviteEntity } from 'src/entities/user-group-invite.entity';
import { InviteUserInput } from '../../inputs/invite-user.input';

@Injectable()
export class UserGroupService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(UserGroupEntity)
        private readonly userGroupRepository: Repository<UserGroupEntity>,
        @InjectRepository(UserGroupInviteEntity)
        private readonly userGroupInviteRepository: Repository<UserGroupInviteEntity>
    ) { }

    public async inviteUser(inviteInput: InviteUserInput, currentUserId: number): Promise<UserGroupInviteEntity> {
        const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
        const invitedUser = await this.userRepository.findOne({
            where: { username: inviteInput.username },
            select: ['id', 'username', 'groupId'],
        });

        if (!invitedUser) {
            throw new NotFoundException('User not found');
        }

        if (invitedUser.id === currentUserId) {
            throw new ConflictException('Cannot invite yourself');
        }

        // Проверяем, нет ли уже активного приглашения
        const existingInvite = await this.userGroupInviteRepository.findOne({
            where: {
                inviterId: currentUserId,
                inviteeUsername: inviteInput.username,
            },
        });

        if (existingInvite) {
            throw new ConflictException('Invite already sent');
        }

        // Проверяем, не состоит ли пользователь уже в группе
        if (invitedUser.groupId) {
            throw new ConflictException('User already belongs to a group');
        }

        let group = currentUser.group;

        if (!group) {
            group = this.userGroupRepository.create({
                name: `Group ${currentUser.username}`,
                ownerId: currentUser.id,
            });
            await this.userGroupRepository.save(group);
        }

        // Создаём приглашение
        const invite = this.userGroupInviteRepository.create({
            groupId: group.id,
            inviterId: currentUserId,
            inviteeUsername: inviteInput.username,
        });

        await this.userGroupInviteRepository.save(invite);

        return invite;
    }

    public async getPendingInvitesByUsername(username: string): Promise<UserGroupInviteEntity[]> {
        return await this.userGroupInviteRepository.find({
            where: { inviteeUsername: username },
            relations: ['group', 'inviter'],
            order: { createdAt: 'DESC' },
        });
    }

    public async acceptInvite(inviteId: number, userId: number): Promise<UserGroupEntity> {
        const invite = await this.userGroupInviteRepository.findOne({
            where: { id: inviteId },
            relations: ['group', 'inviter'],
        });

        if (!invite) {
            throw new NotFoundException('Invite not found');
        }

        const currentUser = await this.userRepository.findOne({ where: { id: userId } });

        if (currentUser.username !== invite.inviteeUsername) {
            throw new ConflictException('This invite does not belong to you');
        }

        // Удаляем приглашение
        await this.userGroupInviteRepository.remove(invite);

        // Добавляем пользователя в группу
        currentUser.groupId = invite.groupId;
        await this.userRepository.save(currentUser);

        return invite.group;
    }

    public async getUserGroupMembers(groupId: number): Promise<UserEntity[]> {
        return await this.userRepository.find({
            where: { groupId },
            relations: ['deposits'],
        });
    }

    public async getGroupOwner(groupId: number): Promise<UserEntity | null> {
        if (!groupId) return null;

        const group = await this.userGroupRepository.findOne({
            where: { id: groupId },
            relations: ['users'],
        });

        if (!group || !group.ownerId) return null;

        return await this.userRepository.findOne({
            where: { id: group.ownerId },
        });
    }

    public async getGroupMemberUserIds(groupId: number): Promise<number[]> {
        if (!groupId) return [];

        const members = await this.userRepository.find({
            where: { groupId },
            select: ['id'],
        });

        return members.map(m => m.id);
    }

    public async getCurrentUserWithGroup(userId: number): Promise<UserEntity | null> {
        return await this.userRepository.findOne({
            where: { id: userId },
            relations: ['group'],
        });
    }
}
