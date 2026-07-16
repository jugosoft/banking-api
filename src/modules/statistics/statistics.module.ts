import { Module } from '@nestjs/common';
import { StatisticsController } from './controllers/statistics.controller';
import { StatisticsService } from './services/statistics.service';
import { DepositEntity } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([DepositEntity])],
    controllers: [StatisticsController],
    providers: [
        StatisticsService
    ],
    exports: [StatisticsService]
})
export class StatisticsModule { }
