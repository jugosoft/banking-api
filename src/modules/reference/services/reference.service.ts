import { BankEntity, DepositTypeEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReferenceService {
    private readonly depositTypeRepository: Repository<DepositTypeEntity>;
    private readonly bankRepository: Repository<BankEntity>;

    constructor(private dataSource: DataSource) {
        this.depositTypeRepository = dataSource.getRepository(DepositTypeEntity);
        this.bankRepository = dataSource.getRepository(BankEntity);
    }

    // CRUD для deposit_type
    async getDepositTypes(): Promise<DepositTypeEntity[]> {
        return await this.depositTypeRepository.find();
    }

    async getDepositType(id: string): Promise<DepositTypeEntity | null> {
        return await this.depositTypeRepository.findOne({
            where: { id: parseInt(id) },
        });
    }

    async createDepositType(body: { type: string; name: string }): Promise<DepositTypeEntity> {
        const depositType = this.depositTypeRepository.create(body);
        return await this.depositTypeRepository.save(depositType);
    }

    async updateDepositType(id: string, body: { type?: string; name?: string }): Promise<DepositTypeEntity | null> {
        const depositType = await this.depositTypeRepository.findOne({
            where: { id: parseInt(id) },
        });

        if (!depositType) {
            return null;
        }

        Object.assign(depositType, body);
        return await this.depositTypeRepository.save(depositType);
    }

    async deleteDepositType(id: string): Promise<boolean> {
        const result = await this.depositTypeRepository.delete(parseInt(id));
        return result.affected > 0;
    }

    // CRUD для bank
    async getBanks(): Promise<BankEntity[]> {
        return await this.bankRepository.find();
    }

    async getBank(id: string): Promise<BankEntity | null> {
        return await this.bankRepository.findOne({
            where: { id: parseInt(id) },
        });
    }

    async createBank(body: { name: string; shortName: string }): Promise<BankEntity> {
        const bank = this.bankRepository.create(body);
        return await this.bankRepository.save(bank);
    }

    async updateBank(id: string, body: { name?: string; shortName?: string }): Promise<BankEntity | null> {
        const bank = await this.bankRepository.findOne({
            where: { id: parseInt(id) },
        });

        if (!bank) {
            return null;
        }

        Object.assign(bank, body);
        return await this.bankRepository.save(bank);
    }

    async deleteBank(id: string): Promise<boolean> {
        const result = await this.bankRepository.delete(parseInt(id));
        return result.affected > 0;
    }
}