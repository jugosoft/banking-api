import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UsePipes, ValidationPipe, Res } from '@nestjs/common';
import { Response } from 'express';

import { GetCurrentUserId, GetCurrentUser, CustomValidationPipe } from 'src/common';
import { AuthRegisterInput } from '../inputs/auth-register.input';
import { AuthService } from '../services/auth.service';
import { AtGuard, RtGuard } from '@guards';
import { ILoginResponse } from '../types/login-response.type';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

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
    ): Promise<ILoginResponse> {
        const user = await this.authService.registerLocal(authRegisterInput);

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
    async logout(@GetCurrentUserId() userId: number, @Res({ passthrough: true }) response: Response): Promise<ILoginResponse> {
        // await this.authService.logout(userId);
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
        return {
            success: true,
            statusCode: HttpStatus.OK
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
