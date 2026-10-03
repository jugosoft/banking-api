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
            relations: ['bank', 'depositType', 'user'],
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
                    where: { id: invest.id }
                });

                if (existingInvest) {
                    // Создаём снимок перед обновлением
                    await this.investSnapshotRepository.save({
                        investId: existingInvest.id,
                        amount: invest.amount,
                        date: snapshotDate
                    });

                    // Обновляем существующую инвестицию (без relations, чтобы не ломать FK)
                    await this.investRepository.save({
                        id: existingInvest.id,
                        amount: invest.amount,
                        name: invest.name,
                        description: invest.description,
                        bankId: invest.bankId,
                        depositTypeId: invest.depositTypeId,
                        userId
                    });

                    return this.getInvest(existingInvest.id, userId);
                }
            }

            const newInvest = this.investRepository.create({ ...invest, userId });
            await this.investRepository.save(newInvest);

            // Создаём начальный снимок для новой инвестиции
            await this.investSnapshotRepository.save({
                investId: newInvest.id,
                amount: invest.amount,
                date: snapshotDate
            });

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
