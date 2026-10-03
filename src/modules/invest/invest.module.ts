import { Module } from '@nestjs/common';
import { InvestController } from './invest.controller';
import { InvestService } from './services/invest.service';
import { InvestEntity } from '@entities';
import { InvestSnapshotEntity } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([InvestEntity, InvestSnapshotEntity])],
    controllers: [InvestController],
    providers: [
        InvestService
    ]
})
export class InvestModule { }
