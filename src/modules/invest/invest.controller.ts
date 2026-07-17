import { Body, Controller, Get, Post, Param, UseGuards, Query, HttpStatus, HttpException, Delete, HttpCode } from '@nestjs/common';
import { AtGuard } from '@common/guards';
import { IApiResponse, IPaginatedResponse } from '@common/types';
import { InvestResponseDto } from './dto/invest-response.dto';
import { ISaveInvestDto } from './dto/invest.dto';
import { InvestListItemResponseDto } from './dto/invest-list-response.dto';
import { GetCurrentUserId } from '@common/decorators';
import { InvestService } from './services/invest.service';

@Controller('invest')
export class InvestController {

    public constructor(private readonly investService: InvestService) { }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('list')
    public async getInvestList(
        @Query('page') page: number = 0,
        @Query('size') size: number = 10,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<IPaginatedResponse<InvestListItemResponseDto>>> {
        const invests = await this.investService.getInvestList(page, size, userId);
        const investDtos = invests.items.map(invest => InvestListItemResponseDto.fromEntity(invest));
        return {
            success: true,
            data: {
                hasMore: false,
                items: investDtos,
                page: page,
                size: size,
                total: 10
            }
        }
    }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    public async getInvest(
        @Param('id') id: number,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<InvestResponseDto>> {
        const invest = await this.investService.getInvest(id, userId);
        return {
            success: true,
            data: InvestResponseDto.fromEntity(invest)
        }
    }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post('save')
    public async saveInvest(
        @Body() invest: ISaveInvestDto,
        @GetCurrentUserId() userId: number,
    ): Promise<IApiResponse<InvestResponseDto>> {
        try {
            const newInvest = await this.investService.saveInvest(invest, userId);
            const investDto = InvestResponseDto.fromEntity(newInvest);
            return {
                success: true,
                data: investDto
            }
        } catch (error) {
            // Обработка ошибки сохранения инвестиции
            throw new HttpException({
                error: {
                    code: 'INVEST_SAVE_ERROR',
                    message: error.message || 'Ошибка при сохранении инвестиции'
                }
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    public async deleteInvest(
        @Param('id') id: number,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<number>> {
        try {
            const investId = await this.investService.deleteInvest(id, userId);
            return {
                success: true,
                data: investId
            };
        } catch (error) {
            throw new HttpException({
                error: {
                    code: 'INVEST_DELETE_ERROR',
                    message: error.message || 'Ошибка при удалении инвестиции'
                }
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
