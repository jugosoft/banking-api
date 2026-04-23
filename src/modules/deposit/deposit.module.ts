import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './services/deposit.service';
import { Deposit } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Deposit])],
    controllers: [DepositController],
    providers: [
        DepositService
    ]
})
export class DepositModule { }
