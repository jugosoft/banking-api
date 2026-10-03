import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestEntity, InvestSnapshotEntity } from '@entities';
import { ISaveInvestDto } from '../dto/invest.dto';

@Injectable()
export class InvestService {
    public constructor(
        @InjectRepository(InvestEntity)
        private readonly investRepository: Repository<InvestEntity>,
        @InjectRepository(InvestSnapshotEntity)
        private readonly investSnapshotRepository: Repository<InvestSnapshotEntity>,
    ) { }

    public async getInvestList(page: number = 0, limit: number = 10, userId: number): Promise<{ items: InvestEntity[], total: number }> {
        const skip = page * limit;
        const [items, total] = await this.investRepository.findAndCount({
            relations: ['bank', 'depositType', 'user', 'snapshots'],
            skip,
            take: limit,
            where: { userId }
        });
        return { items, total };
    }

    public async getInvest(id: number, userId: number): Promise<InvestEntity> {
        const invest = await this.investRepository.findOne({
            relations: ['bank', 'depositType', 'user', 'snapshots'],
            where: { id }
        });

        if (!invest) {
            throw new NotFoundException('Invest not found');
        }

        if (invest.userId !== userId) {
            throw new Error('Access denied. Invest does not belong to user.');
        }

        return invest;
    }

    public async deleteInvest(id: number, userId: number): Promise<number> {
        const invest = await this.getInvest(id, userId);
        if (invest.userId !== userId) {
            throw new Error('Access denied. Cannot delete another user investment.');
        }
        await this.investRepository.remove(invest);
        return id;
    }

    public async saveInvest({ invest }: ISaveInvestDto, userId: number): Promise<InvestEntity> {
        try {
            const snapshotDate = invest.snapshotDate ? new Date(invest.snapshotDate) : new Date();

            // Проверяем, существует ли уже инвестиция с таким ID
            if (invest.id) {
                const existingInvest = await this.investRepository.findOne({
                    where: { id: invest.id },
                    relations: ['snapshots']
                });

                if (existingInvest) {
                    // Создаём снимок перед обновлением
                    const snapshot = this.investSnapshotRepository.create({
                        invest: existingInvest,
                        investId: existingInvest.id,
                        amount: invest.amount,
                        date: snapshotDate
                    });
                    await this.investSnapshotRepository.save(snapshot);

                    // Обновляем существующую инвестицию
                    return await this.investRepository.save({
                        ...existingInvest,
                        ...invest,
                        userId
                    });
                }
            }

            const newInvest = this.investRepository.create({ ...invest, userId });
            await this.investRepository.save(newInvest);

            // Создаём начальный снимок для новой инвестиции
            const snapshot = this.investSnapshotRepository.create({
                invest: newInvest,
                investId: newInvest.id,
                amount: invest.amount,
                date: snapshotDate
            });
            await this.investSnapshotRepository.save(snapshot);

            return this.getInvest(newInvest.id, newInvest.userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save investment: ' + error.message);
        }
    }

    public async getInvestSnapshots(investId: number): Promise<InvestSnapshotEntity[]> {
        return this.investSnapshotRepository.find({
            where: { investId },
            order: { date: 'ASC' }
        });
    }
}
