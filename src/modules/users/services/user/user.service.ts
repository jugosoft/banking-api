import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/entities/user.entity';
import { CreateUserInput } from '../../inputs/create-user.input';
import { UpdateUserInput } from '../../inputs/update-user.input';
import { UpdateUserRtInput } from '../../inputs/update-user-rt.input';
import { ErrorCode } from '@constants';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
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
        return await this.userRepository.findOne({ where: { email: email } });
    }

    public async getOneUserByName(name: string): Promise<UserEntity> | null {
        return await this.userRepository.findOne({ where: { name: name } });
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
        const result = await this.userRepository.update({ id: updateUserRtInput.userId }, { ...updateUserRtInput });
        return await this.getOneUser(updateUserRtInput.userId);
    }

    public async removeRt(userId: number): Promise<void> {
        await this.userRepository.update(userId, { hashedRT: null });
    }
}
