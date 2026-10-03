import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './controllers/statistics.controller';
import { StatisticsService } from './services/statistics.service';
import { DepositEntity, InvestEntity, InvestSnapshotEntity } from '@entities';

@Module({
    imports: [TypeOrmModule.forFeature([DepositEntity, InvestEntity, InvestSnapshotEntity])],
    controllers: [StatisticsController],
    providers: [
        StatisticsService
    ],
    exports: [StatisticsService]
})
export class StatisticsModule { }
