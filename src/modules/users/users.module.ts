import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from '@entities';
import { UserGroupEntity } from '@entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserGroupEntity])
    ],
    providers: [
        UserService,
    ],
    controllers: [
        UserController
    ],
    exports: [
        UserService
    ]
})
export class UserModule { }
