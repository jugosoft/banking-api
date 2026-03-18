import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { DepositInput } from './inputs/deposit.input';
import { DepositService } from './services/deposit.service';
import { Deposit } from 'src/entities/deposit.entity';

@Controller('deposit')
export class DepositController {

    public constructor(private readonly depositService: DepositService) { }

    @Get('list')
    public async getDepositList(): Promise<Deposit[]> {
        return await this.depositService.getDepositList();
    }

    @Get(':id')
    public async getDeposit(
        @Param('id') id: string
    ): Promise<Deposit> {
        return await this.depositService.getDeposit(id);
    }

    @Post('save')
    public async saveDeposit(
        @Body() deposit: DepositInput
    ): Promise<boolean> {
        return await this.depositService.saveDeposit(deposit);
    }
}
