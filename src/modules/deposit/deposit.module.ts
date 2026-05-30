import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './services/deposit.service';
import { DepositEntity } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([DepositEntity])],
    controllers: [DepositController],
    providers: [
        DepositService
    ]
})
export class DepositModule { }
