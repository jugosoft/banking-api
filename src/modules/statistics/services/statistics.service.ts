import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepositEntity, InvestEntity } from '@entities';
import { StatisticsResponseDto, NearestDepositClosingInfo } from '../dto/statistics-response.dto';
import { MoreThan, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

@Injectable()
export class StatisticsService {
    public constructor(
        @InjectRepository(DepositEntity)
        private readonly depositRepository: Repository<DepositEntity>,
        @InjectRepository(InvestEntity)
        private readonly investRepository: Repository<InvestEntity>,
    ) { }

    public async getStatistics(userId: number): Promise<StatisticsResponseDto> {
        // Получаем все актуальные депозиты (текущая дата входит в интервал [startDate, endDate])
        const today = new Date();
        const deposits = await this.depositRepository.find({
            where: {
                userId,
                startDate: LessThanOrEqual(today),
                endDate: MoreThanOrEqual(today),
            },
            relations: ['bank'],
        });

        // Считаем общую сумму и общую процентную ставку
        const totalAmount = deposits.reduce((sum, deposit) => sum + Number(deposit.amount), 0);
        const totalInterest = deposits.length
            ? deposits.reduce((sum, deposit) => sum + Number(deposit.percent), 0) / deposits.length
            : null;

        // Расчёт текущего дохода по вкладам (простые проценты без капитализации)
        const currentIncome = deposits.reduce((sum, deposit) => {
            const startDate = new Date(deposit.startDate);
            const now = new Date();
            
            // Вычисляем количество дней с начала вклада
            const timeDiff = now.getTime() - startDate.getTime();
            const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            
            // Для расчета используем фактическое количество дней и 365-дневную базу
            const income = daysPassed > 0
                ? Number(deposit.amount) * (Number(deposit.percent) / 100) * (daysPassed / 365)
                : 0;

            return sum + income;
        }, 0);

        // Находим ближайший к закрытию депозит
        let nearestDepositClosingInfo: NearestDepositClosingInfo | null = null;
        if (deposits.length > 0) {
            const nearestDeposit = deposits.reduce((prev, current) => {
                return (prev.endDate < current.endDate) ? prev : current;
            });

            nearestDepositClosingInfo = {
                id: nearestDeposit.id,
                bankName: nearestDeposit.bank!.name,
                closeDate: nearestDeposit.endDate,
            };
        }

        return StatisticsResponseDto.create(totalAmount, totalInterest, currentIncome, nearestDepositClosingInfo);
    }

    public async getInvestStats(userId: number): Promise<number> {
        // Считаем общую сумму по всем инвестиционным счетам
        const invests = await this.investRepository.find({
            where: {
                userId,
                archived: Equal(false),
            },
        });

        return invests.reduce((sum, invest) => sum + Number(invest.amount), 0);
    }
}
