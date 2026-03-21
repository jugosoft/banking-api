import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UsePipes, ValidationPipe, Res, Get } from '@nestjs/common';
import { Response } from 'express';

import { GetCurrentUserId, GetCurrentUser, CustomValidationPipe, IApiResponse, UserInfo } from 'src/common';
import { AuthRegisterInput } from '../inputs/auth-register.input';
import { AuthService } from '../services/auth.service';
import { AtGuard, RtGuard } from '@guards';
import { IGetCurrentUserResponse } from '../types/get-current-user-response.type';
import { IRegisterResponse } from '../types';
import { UserService } from '@modules/users/services/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    // @Post('local/login')
    // @HttpCode(HttpStatus.OK)
    // async loginLocal(@Body() authLoginInput: AuthLoginInput, @Res({ passthrough: true }) response: Response): Promise<ILoginResponse> {
    //     const tokens = await this.authService.loginLocal(authLoginInput);
    //     response.cookie('access_token', tokens.accessToken, { httpOnly: true });
    //     response.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    //     return {
    //         success: true,
    //         data: {
    //             user: tokens.user,
    //             accessToken: tokens.accessToken,
    //             refreshToken: tokens.refreshToken
    //         }
    //     };
    // }

    @Post('local/register')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new CustomValidationPipe())
    async registerLocal(
        @Body() authRegisterInput: AuthRegisterInput,
        @Res({ passthrough: true }) response: Response
    ): Promise<IRegisterResponse> {
        let user: UserInfo | null = null;
        try {
            user = await this.authService.registerLocal(authRegisterInput);
        } catch (error) {
            return {
                success: false,
                statusCode: HttpStatus.BAD_REQUEST,
                errors: [{
                    code: 'REGISTRATION_FAIL',
                    message: error.message
                }]
            };
        }

        const tokens = await this.authService.getTokens(user.id, user.email, user);
        await this.authService.updateRtHash(user.id, tokens.refreshToken);

        response.cookie('access_token', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        response.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });

        return {
            success: true,
            statusCode: HttpStatus.CREATED,
            data: {
                ...user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            },
        };
    }

    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUserId() userId: number, @Res({ passthrough: true }) response: Response): Promise<IApiResponse<string>> {
        await this.authService.logout(userId);
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
        return {
            success: true,
            statusCode: HttpStatus.OK,
            data: 'Ну и пошёл (а) на хер! (с увожением)'
        };
    }

    @UseGuards(AtGuard)
    @Get('currentUser')
    @HttpCode(HttpStatus.OK)
    public async getCurrentUser(@GetCurrentUserId() userId: number): Promise<IGetCurrentUserResponse> {
        const user = await this.userService.getOneUser(userId);
        if (!user) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                success: false,
                errors: [{
                    code: 'UNAUTHORIZED',
                    message: 'User not found'
                }]
            }
        }

        return {
            success: true,
            statusCode: HttpStatus.OK,
            data: user
        };
    }

    // @UseGuards(RtGuard)
    // @Post('refresh')
    // @HttpCode(HttpStatus.OK)
    // async refreshTokens(
    //     @GetCurrentUserId() userId: number,
    //     @GetCurrentUser('refreshToken') refreshToken: string,
    //     @Res({ passthrough: true }) response: Response
    // ): Promise<ILoginResponse> {
    //     const tokens = await this.authService.refreshTokens(userId, refreshToken);
    //     response.cookie('access_token', tokens.accessToken, { httpOnly: true });
    //     response.cookie('refresh_token', tokensfce3vhjk,.refreshToken, { httpOnly: true });
    //     return {
    //         success: true,
    //         data: {
    //             user: tokens.user,
    //             accessToken: tokens.accessToken,
    //             refreshToken: tokens.refreshToken
    //         }
    //     };
    // }
}
