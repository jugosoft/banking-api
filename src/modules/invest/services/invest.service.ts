import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestEntity } from '@entities';
import { ISaveInvestDto } from '../dto/invest.dto';

@Injectable()
export class InvestService {
    public constructor(
        @InjectRepository(InvestEntity)
        private readonly investRepository: Repository<InvestEntity>,
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
            relations: ['bank', 'depositType', 'user'],
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
            // Проверяем, существует ли уже инвестиция с таким ID
            if (invest.id) {
                const existingInvest = await this.investRepository.findOne({ where: { id: invest.id } });

                if (existingInvest) {
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
            return this.getInvest(newInvest.id, newInvest.userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save investment: ' + error.message);
        }
    }
}
