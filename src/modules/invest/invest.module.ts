import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestEntity, InvestSnapshotEntity } from '@entities';
import { InvestController } from './invest.controller';
import { InvestService } from './services/invest.service';

@Module({
    imports: [TypeOrmModule.forFeature([InvestEntity, InvestSnapshotEntity])],
    controllers: [InvestController],
    providers: [
        InvestService
    ]
})
export class InvestModule { }
