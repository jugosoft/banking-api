import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../types/jwtPayload.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => request?.cookies?.refresh_token, 
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('RT_SECRET'),
        });
    }

    // Возвращаем только данные пользователя
    public validate(payload: JwtPayload) {
        return {
            userId: payload.sub,
            username: payload.username,
        };
    }
}