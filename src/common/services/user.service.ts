import { UserEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    public async createUser(input: { name: string, email: string, password: string }): Promise<UserEntity> {
        const user = this.userRepository.create({
            ...input,
            password: await this.hashPassword(input.password),
        });

        return await this.userRepository.save(user);
    }

    public async findUserByEmail(email: string): Promise<UserEntity | null> {
        return await this.userRepository.findOneBy({ email });
    }

    public async findUserById(id: number): Promise<UserEntity | null> {
        return await this.userRepository.findOneBy({ id });
    }

    public async updateRt(userId: number, hashedRT: string): Promise<void> {
        await this.userRepository.update(userId, { hashedRT });
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hash = await import('bcrypt').then(m => m.hash(password, saltRounds));
        return hash;
    }
}