import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './services/user/user.service';
import { UserGroupService } from './services/user-group/user-group.service';
import { UserController } from './controllers/user.controller';
import { UserGroupController } from './controllers/user-group.controller';
import { UserEntity } from '@entities';
import { UserGroupEntity } from '@entities';
import { UserGroupInviteEntity } from '@entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserGroupEntity, UserGroupInviteEntity])
    ],
    providers: [
        UserService,
        UserGroupService,
    ],
    controllers: [
        UserController,
        UserGroupController
    ],
    exports: [
        UserService,
        UserGroupService
    ]
})
export class UserModule { }
