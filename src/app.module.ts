import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { AppDataSource } from './ormconfig';
import { DepositModule } from '@modules/deposit/deposit.module';
import { UserModule } from '@modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        TypeOrmModule.forRoot(AppDataSource.options),
        AuthModule,
        UserModule,
        DepositModule
    ],

})
export class AppModule { }
