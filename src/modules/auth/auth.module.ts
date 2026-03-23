import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AtStrategy, RtStrategy } from './strategies';
import { UserModule } from '../users/users.module';
import { UserService } from '@modules/users/services/user/user.service';
import { ConfigService } from '@nestjs/config';


@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('AT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [
        AuthService,
        UserService,
        AtStrategy,
        RtStrategy
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule { }
