import { Body, Controller, Get, Post, Param, UseGuards, Query, HttpStatus, HttpException } from '@nestjs/common';
import { DepositService } from './services/deposit.service';
import { AtGuard } from '@common/guards';
import { IApiResponse, IPaginatedResponse } from '@common/types';
import { DepositResponseDto } from './dto/deposit-response.dto';
import { ISaveDepositDto } from './dto/deposit.dto';

@Controller('deposit')
export class DepositController {

    public constructor(private readonly depositService: DepositService) { }

    @UseGuards(AtGuard)
    @Get('list')
    public async getDepositList(
        // @Query('page') page: number = 1,
        // @Query('size') size: number = 10
    ): Promise<IApiResponse<IPaginatedResponse<DepositResponseDto>>> {
        const deposits = await this.depositService.getPaginatedDepositList();
        const depositDtos = deposits.map(deposit => DepositResponseDto.fromEntity(deposit));
        return {
            success: true,
            data: {
                hasMore: false,
                items: depositDtos,
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
    ): Promise<DepositResponseDto> {
        const deposit = await this.depositService.getDeposit(id);
        return DepositResponseDto.fromEntity(deposit);
    }

    @UseGuards(AtGuard)
    @Post('save')
    public async saveDeposit(
        @Body() deposit: ISaveDepositDto
    ): Promise<IApiResponse<DepositResponseDto>> {
        try {
            const newDeposit = await this.depositService.saveDeposit(deposit);
            const depositDto = DepositResponseDto.fromEntity(newDeposit);
            return {
                success: true,
                data: depositDto
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

