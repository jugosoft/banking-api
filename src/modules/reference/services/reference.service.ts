import { BankEntity, DepositTypeEntity, DepositGroupEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ICreateDepositGroupDto } from '../dto/create-deposit-group.dto';

@Injectable()
export class ReferenceService {
    private readonly depositTypeRepository: Repository<DepositTypeEntity>;
    private readonly bankRepository: Repository<BankEntity>;
    private readonly depositGroupRepository: Repository<DepositGroupEntity>;

    constructor(private dataSource: DataSource) {
        this.depositTypeRepository = dataSource.getRepository(DepositTypeEntity);
        this.bankRepository = dataSource.getRepository(BankEntity);
        this.depositGroupRepository = dataSource.getRepository(DepositGroupEntity);
    }

    // CRUD для deposit_type
    public async getDepositTypes(): Promise<DepositTypeEntity[]> {
        return await this.depositTypeRepository.find({ relations: ['depositGroup'] });
    }

    public async getDepositType(id: number): Promise<DepositTypeEntity | null> {
        return await this.depositTypeRepository.findOne({
            relations: ['depositGroup'],
            where: { id: +id },
        });
    }

    public async createDepositType(name: string, depositGroupId: number, id?: number): Promise<DepositTypeEntity> {
        const depositType = this.depositTypeRepository.create({
            id,
            depositGroupId,
            name
        });
        const newDeposit = await this.depositTypeRepository.save(depositType);
        return this.getDepositType(newDeposit.id);
    }

    public async updateDepositType(id: string, body: { type?: string; name?: string }): Promise<DepositTypeEntity | null> {
        const depositType = await this.depositTypeRepository.findOne({
            where: { id: parseInt(id) },
        });

        if (!depositType) {
            return null;
        }

        Object.assign(depositType, body);
        return await this.depositTypeRepository.save(depositType);
    }

    public async deleteDepositType(id: string): Promise<boolean> {
        const result = await this.depositTypeRepository.delete(parseInt(id));
        return result.affected > 0;
    }

    // CRUD для bank
    public async getBanks(): Promise<BankEntity[]> {
        return await this.bankRepository.find();
    }

    public async getBank(id: string): Promise<BankEntity | null> {
        return await this.bankRepository.findOne({
            where: { id: parseInt(id) },
        });
    }

    public async createBank(body: { name: string; shortName: string }): Promise<BankEntity> {
        const bank = this.bankRepository.create(body);
        return await this.bankRepository.save(bank);
    }

    public async updateBank(id: string, body: { name?: string; shortName?: string }): Promise<BankEntity | null> {
        const bank = await this.bankRepository.findOne({
            where: { id: parseInt(id) },
        });

        if (!bank) {
            return null;
        }

        Object.assign(bank, body);
        return await this.bankRepository.save(bank);
    }

    public async deleteBank(id: string): Promise<boolean> {
        const result = await this.bankRepository.delete(parseInt(id));
        return result.affected > 0;
    }

    // CRUD для deposit_group
    public async getDepositGroups(): Promise<DepositGroupEntity[]> {
        return await this.depositGroupRepository.find();
    }

    public async getDepositGroup(id: string): Promise<DepositGroupEntity | null> {
        return await this.depositGroupRepository.findOne({
            where: { id: parseInt(id) },
        });
    }

    public async createDepositGroup({ depositGroup }: ICreateDepositGroupDto): Promise<DepositGroupEntity> {
        const createdDepositGroup = this.depositGroupRepository.create(depositGroup);
        return await this.depositGroupRepository.save(createdDepositGroup);
    }

    public async updateDepositGroup(id: string, body: { name?: string; code?: string }): Promise<DepositGroupEntity | null> {
        const depositGroup = await this.depositGroupRepository.findOne({
            where: { id: parseInt(id) },
        });

        if (!depositGroup) {
            return null;
        }

        Object.assign(depositGroup, body);
        return await this.depositGroupRepository.save(depositGroup);
    }

    public async deleteDepositGroup(id: string): Promise<boolean> {
        const result = await this.depositGroupRepository.delete(parseInt(id));
        return result.affected > 0;
    }
}
