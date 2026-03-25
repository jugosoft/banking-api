import { Body, Controller, Get, Post, Param, UseGuards, Query, HttpStatus } from '@nestjs/common';
import { DepositInput } from './inputs/deposit.input';
import { DepositService } from './services/deposit.service';
import { Deposit } from 'src/entities/deposit.entity';
import { AtGuard } from '@common/guards';
import { IApiResponse, IPaginatedResponse } from '@common/types';

@Controller('deposit')
export class DepositController {

    public constructor(private readonly depositService: DepositService) { }

    @UseGuards(AtGuard)
    @Get('list')
    public async getDepositList(
        // @Query('page') page: number = 1,
        // @Query('size') size: number = 10
    ): Promise<IApiResponse<IPaginatedResponse<Deposit>>> {
        const data = await this.depositService.getPaginatedDepositList();
        return {
            statusCode: HttpStatus.OK,
            success: true,
            data
        }
    }

    @UseGuards(AtGuard)
    @Get(':id')
    public async getDeposit(
        @Param('id') id: string
    ): Promise<Deposit> {
        return await this.depositService.getDeposit(id);
    }

    @UseGuards(AtGuard)
    @Post('save')
    public async saveDeposit(
        @Body() deposit: DepositInput
    ): Promise<boolean> {
        return await this.depositService.saveDeposit(deposit);
    }
}
