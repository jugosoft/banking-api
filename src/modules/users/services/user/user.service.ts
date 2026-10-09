import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/entities/user.entity';
import { UserGroupEntity } from 'src/entities/deposit-user-group.entity';
import { CreateUserInput } from '../../inputs/create-user.input';
import { UpdateUserInput } from '../../inputs/update-user.input';
import { UpdateUserRtInput } from '../../inputs/update-user-rt.input';
import { InviteUserInput } from '../../inputs/invite-user.input';
import { ErrorCode } from '@constants';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(UserGroupEntity)
        private readonly userGroupRepository: Repository<UserGroupEntity>
    ) { }

    public async createUser(createUserInput: CreateUserInput): Promise<UserEntity> {
        return await this.userRepository.save({ ...createUserInput });
    }

    public async getOneUser(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id: id } });
        if (!user) {
            throw new Error(ErrorCode.NO_USER);
        }
        return user;
    }

    public async getOneUserByEmail(email: string): Promise<UserEntity> | null {
        return await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'username', 'password', 'hashedRT', 'createdAt', 'updatedAt']
        });
    }

    public async getOneUserByUsername(username: string): Promise<UserEntity> | null {
        return await this.userRepository.findOne({
            where: { username },
            select: ['id', 'email', 'username', 'password', 'hashedRT', 'createdAt', 'updatedAt']
        });
    }

    public async getAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    public async removeOneUser(id: number): Promise<number> | null {
        const deleteResult = await this.userRepository.delete({ id });
        if (deleteResult.affected !== 0) {
            return id;
        }
        return null;
    }

    public async updateUser(updateUserInput: UpdateUserInput): Promise<UserEntity> {
        await this.userRepository.update({ id: updateUserInput.id }, { ...updateUserInput });
        return await this.getOneUser(updateUserInput.id);
    }

    public async updateUserRt(updateUserRtInput: UpdateUserRtInput): Promise<UserEntity> {
        const result = await this.userRepository.update({ id: updateUserRtInput.id }, { ...updateUserRtInput });
        return await this.getOneUser(updateUserRtInput.id);
    }

    public async removeUserRt(userId: number): Promise<void> {
        await this.userRepository.update(userId, { hashedRT: null });
    }

    public async inviteUser(inviteInput: InviteUserInput, currentUserId: number): Promise<UserEntity> {
        const currentUser = await this.getOneUser(currentUserId);
        const invitedUser = await this.getOneUserByUsername(inviteInput.username);

        if (!invitedUser) {
            throw new NotFoundException('User not found');
        }

        if (invitedUser.id === currentUserId) {
            throw new ConflictException('Cannot invite yourself');
        }

        let group = currentUser.group;

        if (!group) {
            group = this.userGroupRepository.create({
                name: `Group ${currentUser.username}`,
                ownerId: currentUser.id,
            });
            await this.userGroupRepository.save(group);
        }

        if (invitedUser.groupId && invitedUser.groupId !== group.id) {
            throw new ConflictException('User already belongs to another group');
        }

        invitedUser.groupId = group.id;
        await this.userRepository.save(invitedUser);

        return await this.getOneUser(invitedUser.id);
    }

    public async getUserGroupMembers(groupId: number): Promise<UserEntity[]> {
        return await this.userRepository.find({
            where: { groupId },
            relations: ['deposits'],
        });
    }
}
