import { Body, Controller, Get, Post, Param, UseGuards, Query, HttpStatus, HttpException, Delete, HttpCode } from '@nestjs/common';
import { DepositService } from './services/deposit.service';
import { AtGuard } from '@common/guards';
import { IApiResponse, IPaginatedResponse } from '@common/types';
import { DepositResponseDto } from './dto/deposit-response.dto';
import { ISaveDepositDto } from './dto/deposit.dto';
import { DepositListItemResponseDto } from './dto/deposit-list-response.dto';
import { GetCurrentUserId } from '@common/decorators';

@Controller('deposit')
export class DepositController {

    public constructor(private readonly depositService: DepositService) { }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('list')
    public async getDepositList(
        @Query('page') page: number = 0,
        @Query('size') size: number = 10,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<IPaginatedResponse<DepositListItemResponseDto>>> {
        const deposits = await this.depositService.getDepositList(page, size, userId);
        const depositDtos = deposits.items.map(deposit => DepositListItemResponseDto.fromEntity(deposit));
        return {
            success: true,
            data: {
                hasMore: false,
                items: depositDtos,
                page: page,
                size: size,
                total: 10
            }
        }
    }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    public async getDeposit(
        @Param('id') id: number
    ): Promise<DepositResponseDto> {
        const deposit = await this.depositService.getDeposit(id);
        return DepositResponseDto.fromEntity(deposit);
    }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post('save')
    public async saveDeposit(
        @Body() deposit: ISaveDepositDto,
        @GetCurrentUserId() userId: number,
    ): Promise<IApiResponse<DepositResponseDto>> {
        try {
            const newDeposit = await this.depositService.saveDeposit(deposit, userId);
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

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    public async deleteDeposit(
        @Param('id') id: number,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<number>> {
        try {
            const depositId = await this.depositService.deleteDeposit(id, userId);
            return {
                success: true,
                data: depositId
            };
        } catch (error) {
            throw new HttpException({
                error: {
                    code: 'DEPOSIT_DELETE_ERROR',
                    message: error.message || 'Ошибка при удалении депозита'
                }
            }, HttpStatus.BAD_REQUEST);
        }
    }
}