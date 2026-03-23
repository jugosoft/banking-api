import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@entities';
import { UserService } from '@modules/users/services/user/user.service';
import { IUserInfo } from '@common/types/user';
import { TokenPair } from '../types';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async loginLocal(dto: { username: string, password: string }): Promise<IUserInfo & TokenPair> {
        const user = await this.userService.getOneUserByUsername(dto.username);
        if (!user) {
            throw new Error('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }

        const userInfo = this.toUserInfo(user);

        const tokens = await this.getTokens(user.id, user.email, userInfo);
        await this.updateRtHash(user.id, tokens.refreshToken);

        return { ...userInfo, ...tokens };
    }


    public async getCurrentUser(userId: number): Promise<IUserInfo> {
        const user = await this.userService.getOneUser(userId);
        if (!user) {
            throw new Error('Invalid username or password');
        }
        return this.toUserInfo(user);
    }

    public async registerLocal(dto: { username: string, email: string, password: string }): Promise<IUserInfo> {
        const existingUserByEmail = await this.userService.getOneUserByEmail(dto.email);
        if (existingUserByEmail) {
            throw new Error('Email already exists');
        }

        const existingUserByUsername = await this.userService.getOneUserByUsername(dto.username);
        if (existingUserByUsername) {
            throw new Error('Username already exists');
        }

        try {
            const user = await this.userService.createUser({
                email: dto.email,
                username: dto.username,
                password: await this.hashData(dto.password)
            });
            const userInfo: IUserInfo = {
                id: user.id,
                email: user.email,
                username: user.username,
                roles: [],
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };

            const tokens = await this.getTokens(user.id, user.email, userInfo);
            await this.updateRtHash(user.id, tokens.refreshToken);

            return { ...userInfo };
        } catch (error) {
            throw new Error('Registration failed');
        }
    }

    public async logout(userId: number) {
        return this.userService.removeUserRt(userId);
    }

    // public async refreshTokens(userId: number, rt: string) {
    //     const user = await this.usersService.getUserById(userId);
    //     if (!user || !user.hashedRT)
    //         throw new ForbiddenException('Access Denied');
    //     const rtMatches = await bcrypt.compare(rt, user.hashedRT);
    //     if (!rtMatches) throw new ForbiddenException('Access Denied');
    //     const tokens = await this.getTokens(user.id, user.email, user);
    //     await this.updateRtHash(user.id, tokens.refreshToken);
    //     return tokens;
    // }

    public async updateRtHash(id: number, rt: string) {
        const hashedRT = await this.hashData(rt);
        await this.userService.updateUserRt({ id, hashedRT });
    }

    public async getTokens(userId: number, email: string, user: IUserInfo) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username: user.username,
                },
                {
                    secret: this.configService.get('AT_SECRET'),
                    expiresIn: '1d',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username: user.username,
                },
                {
                    secret: this.configService.get('RT_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken
        };
    }

    private async hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    private toUserInfo(user: UserEntity): IUserInfo {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles?.map(role => ({ id: role.id, name: role.name })) ?? [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}
