import { Injectable } from '@nestjs/common';
import { DataSource, Repository, FindOptionsWhere } from 'typeorm';
import { Deposit } from '@entities';
import { ErrorCode } from '@constants';
import { IPaginatedResponse } from '@common/types';

@Injectable()
export class DepositService {
    private readonly depositRepository: Repository<Deposit>;

    constructor(private dataSource: DataSource) {
        this.depositRepository = dataSource.getRepository(Deposit);
    }

    async getPaginatedDepositList(page: number = 1, size: number = 10): Promise<IPaginatedResponse<Deposit>> {
        const skip = (page - 1) * size;
        const take = size;

        const where: FindOptionsWhere<Deposit> = { archived: false };

        const [items, total] = await this.depositRepository.findAndCount({
            where,
            skip,
            take,
            order: { id: 'DESC' }
        });

        const hasMore = skip + items.length < total;

        return {
            items,
            total,
            page,
            size,
            hasMore
        };
    }

    async getDeposit(id: string): Promise<any> {
        const deposit = await this.depositRepository.findOne({
            where: { id: parseInt(id) },
        });

        if (!deposit) {
            return {
                error: { code: 'NO_DEPOSIT', message: 'Deposit not found' },
            };
        }

        return { deposit };
    }

    async saveDeposit(deposit: any): Promise<any> {
        try {
            if (deposit.id) {
                // Обновление существующего депозита
                await this.depositRepository.update(deposit.id, deposit);
            } else {
                // Создание нового депозита
                const newDeposit = this.depositRepository.create(deposit);
                await this.depositRepository.save(newDeposit);
            }
            return true;
        } catch (error) {
            return {
                error: {
                    code: ErrorCode.DEPOSIT_SAVE_ERROR,
                    message: 'Failed to save deposit',
                },
            };
        }
    }
}