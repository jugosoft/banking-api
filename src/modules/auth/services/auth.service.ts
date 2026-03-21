import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInfo } from '../../../common/types/user/user-info.type';
import { ILoginResponse } from '../types/login-response.type';
import { UserService } from '@common/services';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async loginLocal(dto: { email: string, password: string }): Promise<UserInfo> {
        const user = await this.usersService.findUserByEmail(dto.email);
        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        const userInfo: UserInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles.map(role => ({ id: role.id, name: role.name })),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return userInfo;
    }

    public async registerLocal(dto: { name: string, email: string, password: string }): Promise<UserInfo> {
        try {
            const user = await this.usersService.createUser(dto);
            const userInfo: UserInfo = {
                id: user.id,
                email: user.email,
                name: user.name,
                roles: [],
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };

            return { ...userInfo };
        } catch (error) {
            // return { success: false, errors: { registration: [{ code: 'FAILED', message: error.message }] } };
        }
    }

    // public async logout(userId: number) {
    //     return this.usersService.removeRt(userId);
    // }

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

    public async updateRtHash(userId: number, rt: string) {
        const hashedRT = await this.hashData(rt);
        await this.usersService.updateRt(userId, hashedRT);
    }

    public async getTokens(userId: number, email: string, user: UserInfo) {
        const [at, rt] = await Promise.all([
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
            accessToken: at,
            refreshToken: rt,
        };
    }

    private async hashData(data: string) {
        return bcrypt.hash(data, 10);
    }
}
