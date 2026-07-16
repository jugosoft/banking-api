import { Controller, Get, UseGuards, HttpStatus, HttpCode, HttpException, Query } from '@nestjs/common';
import { StatisticsService } from '../services/statistics.service';
import { AtGuard } from '@common/guards';
import { IApiResponse } from '@common/types';
import { StatisticsResponseDto } from '../dto/statistics-response.dto';
import { GetCurrentUserId } from '@common/decorators';

@Controller('statistics')
export class StatisticsController {
    public constructor(private readonly statisticsService: StatisticsService) { }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('deposits')
    public async getStatistics(
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<StatisticsResponseDto>> {
        try {
            const statistics = await this.statisticsService.getStatistics(userId);
            return {
                success: true,
                data: statistics
            };
        } catch (error) {
            throw new HttpException({
                error: {
                    code: 'STATISTICS_GET_ERROR',
                    message: error.message || 'Ошибка при получении статистики'
                }
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
