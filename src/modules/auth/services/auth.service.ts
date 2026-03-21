import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInfo } from '../../../common/types/user/user-info.type';
import { ILoginResponse } from '../types/login-response.type';
import { UserService } from '@modules/users/services/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async loginLocal(dto: { email: string, password: string }): Promise<ILoginResponse> {
        const user = await this.userService.getOneUserByEmail(dto.email);
        if (!user) {
            return {
                success: false,
                statusCode: HttpStatus.UNAUTHORIZED,
                errors: [{
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password'
                }]
            };
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                statusCode: HttpStatus.UNAUTHORIZED,
                errors: [{
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password'
                }]
            };
        }

        const userInfo: UserInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles.map(role => ({ id: role.id, name: role.name })),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        const tokens = await this.getTokens(user.id, user.email, userInfo);
        await this.updateRtHash(user.id, tokens.refreshToken);

        return {
            success: true,
            statusCode: 200,
            data: {
                ...userInfo,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            }
        };
    }

    public async registerLocal(dto: { name: string, email: string, password: string }): Promise<UserInfo> {
        const existingUserByEmail = await this.userService.getOneUserByEmail(dto.email);
        if (existingUserByEmail) {
            throw new Error('Email already exists');
        }

        const existingUserByName = await this.userService.getOneUserByName(dto.name);
        if (existingUserByName) {
            throw new Error('Username already exists');
        }

        try {
            const user = await this.userService.createUser(dto);
            const userInfo: UserInfo = {
                id: user.id,
                email: user.email,
                name: user.name,
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
        return this.userService.removeRt(userId);
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

    public async getTokens(userId: number, email: string, user: UserInfo) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    user
                },
                {
                    secret: this.configService.get('AT_SECRET'),
                    expiresIn: 60 * 15,
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    user
                },
                {
                    secret: this.configService.get('RT_SECRET'),
                    expiresIn: 60 * 60 * 24 * 7,
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
}
