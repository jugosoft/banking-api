import { Module } from '@nestjs/common';
import { InvestController } from './invest.controller';
import { InvestService } from './services/invest.service';
import { InvestEntity } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([InvestEntity])],
    controllers: [InvestController],
    providers: [
        InvestService
    ]
})
export class InvestModule { }
