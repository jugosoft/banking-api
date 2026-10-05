import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { DepositEntity } from 'src/entities/deposit.entity';
import { ISaveDepositDto } from '../dto/deposit.dto';
import { IDepositFilter } from '../models/deposit-filter.model';
import { IPaging } from '../models/paging.model';
import { SortOrder } from '../models/sort-order.model';

@Injectable()
export class DepositService {
    public constructor(
        @InjectRepository(DepositEntity)
        private readonly depositRepository: Repository<DepositEntity>,
    ) { }

    public async getDepositList(
        filter: IDepositFilter,
        paging: IPaging,
        sort?: SortOrder<DepositEntity>,
    ): Promise<{ items: DepositEntity[]; total: number }> {
        const skip = paging.page * paging.limit;

        const where: any = {
            userId: filter.userId,
        };

        if (filter.bankId !== undefined) {
            where.bankId = filter.bankId;
        }

        // При includeHistory: false — только актуальные (текущая дата входит в [startDate, endDate])
        // При includeHistory: true — все вклады без фильтрации по датам
        if (!filter.includeHistory) {
            const today = new Date();
            where.startDate = LessThanOrEqual(today);
            where.endDate = MoreThanOrEqual(today);
        }

        const [items, total] = await this.depositRepository.findAndCount({
            relations: ['bank', 'depositType'],
            skip,
            take: paging.limit,
            where,
            order: sort ?? { endDate: 'desc' },
        });

        return { items, total };
    }

    public async getDeposit(id: number, userId: number): Promise<DepositEntity> {
        const deposit = await this.depositRepository.findOne({
            relations: ['bank', 'depositType'],
            where: { id },
        });

        if (!deposit) {
            throw new NotFoundException('Deposit not found');
        }

        if (deposit.userId !== userId) {
            throw new ForbiddenException('Access denied. Deposit does not belong to user.');
        }

        return deposit;
    }

    public async deleteDeposit(id: number, userId: number): Promise<number> {
        const deposit = await this.getDeposit(id, userId);
        const deletedDeposit = await this.depositRepository.remove(deposit);
        return deletedDeposit.id;
    }

    public async saveDeposit({ deposit }: ISaveDepositDto, userId: number): Promise<DepositEntity> {
        try {
            if (deposit.id) {
                const existingDeposit = await this.depositRepository.findOne({ where: { id: deposit.id } });

                if (existingDeposit) {
                    return await this.depositRepository.save({
                        ...existingDeposit,
                        ...deposit,
                        userId,
                    });
                }
            }

            const newDeposit = this.depositRepository.create({ ...deposit, userId });
            await this.depositRepository.save(newDeposit);
            return this.getDeposit(newDeposit.id, newDeposit.userId);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save deposit: ' + error.message);
        }
    }

    public async getDepositStats(userId: number): Promise<{ totalAmount: number; totalInterest: number }> {
        const { totalAmount, totalInterest } = await this.depositRepository
            .createQueryBuilder('deposit')
            .select('SUM(deposit.amount)', 'totalAmount')
            .addSelect('SUM(deposit.percent)', 'totalInterest')
            .where('deposit.userId = :userId', { userId })
            .getRawOne();

        return {
            totalAmount: totalAmount || 0,
            totalInterest: totalInterest || 0,
        };
    }
}
