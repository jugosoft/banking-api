import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IApiResponse } from '@common/types';
import { IUserInfo } from '@common/types/user';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
    public getRequest(context: ExecutionContext): Request {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException({
                success: false,
                statusCode: 401,
                errors: [
                    {
                        code: 'NO_ACCESS_TOKEN',
                        message: 'Access token not found in cookies'
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
                        code: 'INVALID_TOKEN',
                        message: 'Invalid or expired access token'
                    }
                ]
            } as IApiResponse);
        }
        return user;
    }
}