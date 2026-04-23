import { Body, Controller, Get, Post, Param, UseGuards, Query, HttpStatus, HttpException } from '@nestjs/common';
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
        const items = await this.depositService.getPaginatedDepositList();
        return {
            statusCode: HttpStatus.OK,
            success: true,
            data: {
                hasMore: false,
                items,
                page: 1,
                size: 10,
                total: 10
            }
        }
    }

    @UseGuards(AtGuard)
    @Get(':id')
    public async getDeposit(
        @Param('id') id: number
    ): Promise<Deposit> {
        return await this.depositService.getDeposit(id);
    }

    @UseGuards(AtGuard)
    @Post('save')
    public async saveDeposit(
        @Body() deposit: DepositInput
    ): Promise<IApiResponse<Deposit>> {
        try {
            const newDeposit = await this.depositService.saveDeposit(deposit);
            return {
                statusCode: HttpStatus.CREATED,
                success: true,
                data: newDeposit
            }
        } catch (error) {
            // Обработка ошибки сохранения депозита
            throw new HttpException({
                error: {
                    code: 'DEPOSIT_SAVE_ERROR',
                    message: error.message || 'Ошибка при сохранении депозита'
                }
            }, HttpStatus.BAD_REQUEST);
        }
    }
}

