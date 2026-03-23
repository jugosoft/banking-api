import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../types/jwtPayload.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => request?.cookies?.access_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('AT_SECRET'),
        });
    }

    public validate(payload: JwtPayload): JwtPayload {
        if (!payload.sub || !payload.username) {
            return null;
        }

        return {
            sub: payload.sub,
            username: payload.username,
        };
    }
}
