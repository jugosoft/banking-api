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


@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({}),
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
