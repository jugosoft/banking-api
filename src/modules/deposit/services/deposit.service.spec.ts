import { Test, TestingModule } from '@nestjs/testing';
import { DepositService } from './deposit.service';
import { DataSource, Repository } from 'typeorm';
import { Deposit } from '@entities';
import { ErrorCode } from '@constants';

// Mock для Repository
const mockDepositRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn()
};

// Mock для DataSource
const mockDataSource = {
    getRepository: jest.fn().mockReturnValue(mockDepositRepository)
};

describe('DepositService', () => {
    let service: DepositService;
    let dataSource: DataSource;
    let depositRepository: Repository<Deposit>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DepositService,
                {
                    provide: DataSource,
                    useValue: mockDataSource
                }
            ]
        }).compile();

        service = module.get<DepositService>(DepositService);
        dataSource = module.get<DataSource>(DataSource);
        depositRepository = dataSource.getRepository(Deposit);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDepositList', () => {
        it('should call depositRepository.find with archived: false filter', async () => {
            const mockDeposits = [{ id: 1, archived: false }];
            mockDepositRepository.find.mockResolvedValue(mockDeposits);

            const result = await service.getDepositList();

            expect(depositRepository.find).toHaveBeenCalledWith({ where: { archived: false } });
            expect(result).toEqual({ deposits: mockDeposits });
        });
    });

    describe('getDeposit', () => {
        it('should call depositRepository.findOne with parsed id', async () => {
            const id = '1';
            const mockDeposit = { id: 1 };
            mockDepositRepository.findOne.mockResolvedValue(mockDeposit);

            const result = await service.getDeposit(id);

            expect(depositRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ deposit: mockDeposit });
        });

        it('should return error when deposit not found', async () => {
            const id = '1';
            mockDepositRepository.findOne.mockResolvedValue(null);

            const result = await service.getDeposit(id);

            expect(depositRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({
                error: { code: 'NO_DEPOSIT', message: 'Deposit not found' }
            });
        });
    });

    describe('saveDeposit', () => {
        it('should call depositRepository.update when deposit has id', async () => {
            const deposit = { id: 1, amount: 1000 };
            mockDepositRepository.update.mockResolvedValue(undefined);

            const result = await service.saveDeposit(deposit);

            expect(depositRepository.update).toHaveBeenCalledWith(deposit.id, deposit);
            expect(depositRepository.create).not.toHaveBeenCalled();
            expect(depositRepository.save).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should call depositRepository.create and save when deposit has no id', async () => {
            const deposit = { amount: 1000 };
            const newDeposit = { id: 1, ...deposit };
            mockDepositRepository.create.mockReturnValue(newDeposit);
            mockDepositRepository.save.mockResolvedValue(newDeposit);

            const result = await service.saveDeposit(deposit);

            expect(depositRepository.create).toHaveBeenCalledWith(deposit);
            expect(depositRepository.save).toHaveBeenCalledWith(newDeposit);
            expect(depositRepository.update).not.toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return error when save throws exception', async () => {
            const deposit = { amount: 1000 };
            const error = new Error('Save failed');
            mockDepositRepository.create.mockReturnValue(deposit);
            mockDepositRepository.save.mockRejectedValue(error);

            const result = await service.saveDeposit(deposit);

            expect(depositRepository.create).toHaveBeenCalledWith(deposit);
            expect(depositRepository.save).toHaveBeenCalledWith(deposit);
            expect(result).toEqual({
                error: {
                    code: ErrorCode.DEPOSIT_SAVE_ERROR,
                    message: 'Failed to save deposit'
                }
            });
        });
    });
});