import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IApiResponse } from '@common/types';
import { IUserInfo } from '@common/types/user';

@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
    public getRequest(context: ExecutionContext): Request {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.refresh_token;

        if (!token) {
            throw new UnauthorizedException({
                success: false,
                statusCode: 401,
                errors: [
                    {
                        code: 'NO_REFRESH_TOKEN',
                        message: 'Refresh token not found in cookies'
                    }
                ]
            } as IApiResponse);
        }

        request.headers.authorization = `Bearer ${token}`;
        return request;
    }

    public handleRequest<IUserInfo>(err: Error | null, user: IUserInfo, info: Error): IUserInfo {
        if (err || !user) {
            throw err || new UnauthorizedException({
                success: false,
                statusCode: 401,
                errors: [
                    {
                        code: 'INVALID_REFRESH_TOKEN',
                        message: 'Invalid or expired refresh token'
                    }
                ]
            } as IApiResponse);
        }
        return user;
    }
}