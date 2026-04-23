import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deposit } from 'src/entities/deposit.entity';
import { DepositInput } from '../inputs/deposit.input';

@Injectable()
export class DepositService {
    public constructor(
        @InjectRepository(Deposit)
        private readonly depositRepository: Repository<Deposit>,
    ) { }

    public async getPaginatedDepositList(): Promise<Deposit[]> {
        return await this.depositRepository.find();
    }

    public async getDeposit(id: number): Promise<Deposit> {
        const deposit = await this.depositRepository.findOne({ where: { id } });

        if (!deposit) {
            throw new NotFoundException('Deposit not found');
        }

        return deposit;
    }

    public async saveDeposit(depositInput: DepositInput): Promise<Deposit> {
        try {
            // Проверяем, существует ли уже депозит с таким ID
            if (depositInput.id) {
                const existingDeposit = await this.depositRepository.findOne({ where: { id: depositInput.id } });

                if (existingDeposit) {
                    // Обновляем существующий депозит
                    return await this.depositRepository.save({
                        ...existingDeposit,
                        ...depositInput
                    });
                }
            }

            const newDeposit = this.depositRepository.create(depositInput);
            return await this.depositRepository.save(newDeposit);
        } catch (error) {
            throw new InternalServerErrorException('Failed to save deposit: ' + error.message);
        }
    }
}

