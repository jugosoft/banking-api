import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepositEntity } from '@entities';
import { StatisticsResponseDto, NearestDepositClosingInfo } from '../dto/statistics-response.dto';
import { MoreThan, Equal } from 'typeorm';

@Injectable()
export class StatisticsService {
    public constructor(
        @InjectRepository(DepositEntity)
        private readonly depositRepository: Repository<DepositEntity>,
    ) { }

    public async getStatistics(userId: number): Promise<StatisticsResponseDto> {
        // Получаем все актуальные депозиты (не архивные и дата окончания в будущем)
        const deposits = await this.depositRepository.find({
            where: {
                userId,
                archived: Equal(false),
                endDate: MoreThan(new Date())
            },
            relations: ['bank'],
        });

        // Считаем общую сумму и общую процентную ставку
        const totalAmount = deposits.reduce((sum, deposit) => sum + Number(deposit.amount), 0);
        const totalInterest = deposits.reduce((sum, deposit) => sum + Number(deposit.percent), 0);

        // Находим ближайший к закрытию депозит
        let nearestDepositClosingInfo: NearestDepositClosingInfo | null = null;
        if (deposits.length > 0) {
            const nearestDeposit = deposits.reduce((prev, current) => {
                return (prev.endDate < current.endDate) ? prev : current;
            });

            nearestDepositClosingInfo = {
                id: nearestDeposit.id,
                bankName: nearestDeposit.bank?.name || '',
                closeDate: nearestDeposit.endDate,
            };
        }

        return StatisticsResponseDto.create(totalAmount, totalInterest, nearestDepositClosingInfo);
    }
}
