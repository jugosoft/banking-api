import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepositEntity } from 'src/entities/deposit.entity';
import { ISaveDepositDto } from '../dto/deposit.dto';

@Injectable()
export class DepositService {
    public constructor(
        @InjectRepository(DepositEntity)
        private readonly depositRepository: Repository<DepositEntity>,
    ) { }

    public async getPaginatedDepositList(): Promise<DepositEntity[]> {
        return await this.depositRepository.find();
    }

    public async getDeposit(id: number): Promise<DepositEntity> {
        const deposit = await this.depositRepository.findOne({ where: { id } });

        if (!deposit) {
            throw new NotFoundException('Deposit not found');
        }

        return deposit;
    }

    public async saveDeposit({ deposit }: ISaveDepositDto): Promise<DepositEntity> {
        console.log('Deposit to save:', deposit);

        try {
            // Проверяем, существует ли уже депозит с таким ID
            if (deposit.id) {
                const existingDeposit = await this.depositRepository.findOne({ where: { id: deposit.id } });

                if (existingDeposit) {
                    // Обновляем существующий депозит
                    return await this.depositRepository.save({
                        ...existingDeposit,
                        ...deposit
                    });
                }
            }

            const newDeposit = this.depositRepository.create(deposit);
            return await this.depositRepository.save(newDeposit);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save deposit: ' + error.message);
        }
    }
}

