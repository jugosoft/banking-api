import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceService } from './reference.service';
import { DataSource, Repository } from 'typeorm';
import { Bank, DepositType } from '@entities';
import { getRepositoryToken } from '@nestjs/typeorm';

// Mock для Repository
const mockDepositTypeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn()
};

const mockBankRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn()
};

// Mock для DataSource
const mockDataSource = {
    getRepository: jest.fn()
};

// Устанавливаем возвращаемые значения для getRepository
jest.mock('@nestjs/typeorm', () => ({
    getRepositoryToken: jest.fn().mockImplementation((entity) => {
        if (entity === DepositType) return 'DepositTypeRepository';
        if (entity === Bank) return 'BankRepository';
        return 'UnknownRepository';
    })
}));

describe('ReferenceService', () => {
    let service: ReferenceService;
    let dataSource: DataSource;
    let depositTypeRepository: Repository<DepositType>;
    let bankRepository: Repository<Bank>;

    beforeEach(async () => {
        // Настраиваем mock для getRepository
        (mockDataSource.getRepository as jest.Mock)
            .mockImplementation((entity) => {
                if (entity === DepositType) return mockDepositTypeRepository;
                if (entity === Bank) return mockBankRepository;
                return null;
            });

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReferenceService,
                {
                    provide: DataSource,
                    useValue: mockDataSource
                }
            ]
        }).compile();

        service = module.get<ReferenceService>(ReferenceService);
        dataSource = module.get<DataSource>(DataSource);
        depositTypeRepository = dataSource.getRepository(DepositType);
        bankRepository = dataSource.getRepository(Bank);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getDepositTypes', () => {
        it('should call depositTypeRepository.find', async () => {
            const mockTypes = [{ id: 1, name: 'Type1' }];
            mockDepositTypeRepository.find.mockResolvedValue(mockTypes);
            
            const result = await service.getDepositTypes();
            
            expect(depositTypeRepository.find).toHaveBeenCalled();
            expect(result).toEqual(mockTypes);
        });
    });

    describe('getDepositType', () => {
        it('should call depositTypeRepository.findOne with parsed id', async () => {
            const id = '1';
            const mockType = { id: 1, name: 'Type1' };
            mockDepositTypeRepository.findOne.mockResolvedValue(mockType);
            
            const result = await service.getDepositType(id);
            
            expect(depositTypeRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockType);
        });

        it('should return null when deposit type not found', async () => {
            const id = '1';
            mockDepositTypeRepository.findOne.mockResolvedValue(null);
            
            const result = await service.getDepositType(id);
            
            expect(depositTypeRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toBeNull();
        });
    });

    describe('createDepositType', () => {
        it('should call depositTypeRepository.create and save', async () => {
            const body = { type: 'test', name: 'Test Type' };
            const createdType = { id: 1, ...body };
            mockDepositTypeRepository.create.mockReturnValue(createdType);
            mockDepositTypeRepository.save.mockResolvedValue(createdType);
            
            const result = await service.createDepositType(body);
            
            expect(depositTypeRepository.create).toHaveBeenCalledWith(body);
            expect(depositTypeRepository.save).toHaveBeenCalledWith(createdType);
            expect(result).toEqual(createdType);
        });
    });

    describe('updateDepositType', () => {
        it('should call depositTypeRepository.findOne, update entity and save', async () => {
            const id = '1';
            const body = { name: 'Updated Type' };
            const existingType = { id: 1, type: 'old', name: 'Old Type' };
            const updatedType = { ...existingType, ...body };
            
            mockDepositTypeRepository.findOne.mockResolvedValue(existingType);
            mockDepositTypeRepository.save.mockResolvedValue(updatedType);
            
            const result = await service.updateDepositType(id, body);
            
            expect(depositTypeRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(Object.assign).toHaveBeenCalledWith(existingType, body);
            expect(depositTypeRepository.save).toHaveBeenCalledWith(updatedType);
            expect(result).toEqual(updatedType);
        });

        it('should return null when deposit type not found', async () => {
            const id = '1';
            const body = { name: 'Updated Type' };
            mockDepositTypeRepository.findOne.mockResolvedValue(null);
            
            const result = await service.updateDepositType(id, body);
            
            expect(depositTypeRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(depositTypeRepository.save).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('deleteDepositType', () => {
        it('should call depositTypeRepository.delete and return true when affected', async () => {
            const id = '1';
            mockDepositTypeRepository.delete.mockResolvedValue({ affected: 1 });
            
            const result = await service.deleteDepositType(id);
            
            expect(depositTypeRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });

        it('should return false when not affected', async () => {
            const id = '1';
            mockDepositTypeRepository.delete.mockResolvedValue({ affected: 0 });
            
            const result = await service.deleteDepositType(id);
            
            expect(depositTypeRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(false);
        });
    });

    describe('getBanks', () => {
        it('should call bankRepository.find', async () => {
            const mockBanks = [{ id: 1, name: 'Bank1', shortName: 'B1' }];
            mockBankRepository.find.mockResolvedValue(mockBanks);
            
            const result = await service.getBanks();
            
            expect(bankRepository.find).toHaveBeenCalled();
            expect(result).toEqual(mockBanks);
        });
    });

    describe('getBank', () => {
        it('should call bankRepository.findOne with parsed id', async () => {
            const id = '1';
            const mockBank = { id: 1, name: 'Bank1', shortName: 'B1' };
            mockBankRepository.findOne.mockResolvedValue(mockBank);
            
            const result = await service.getBank(id);
            
            expect(bankRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockBank);
        });

        it('should return null when bank not found', async () => {
            const id = '1';
            mockBankRepository.findOne.mockResolvedValue(null);
            
            const result = await service.getBank(id);
            
            expect(bankRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toBeNull();
        });
    });

    describe('createBank', () => {
        it('should call bankRepository.create and save', async () => {
            const body = { name: 'New Bank', shortName: 'NB' };
            const createdBank = { id: 1, ...body };
            mockBankRepository.create.mockReturnValue(createdBank);
            mockBankRepository.save.mockResolvedValue(createdBank);
            
            const result = await service.createBank(body);
            
            expect(bankRepository.create).toHaveBeenCalledWith(body);
            expect(bankRepository.save).toHaveBeenCalledWith(createdBank);
            expect(result).toEqual(createdBank);
        });
    });

    describe('updateBank', () => {
        it('should call bankRepository.findOne, update entity and save', async () => {
            const id = '1';
            const body = { name: 'Updated Bank' };
            const existingBank = { id: 1, name: 'Old Bank', shortName: 'OB' };
            const updatedBank = { ...existingBank, ...body };
            
            mockBankRepository.findOne.mockResolvedValue(existingBank);
            mockBankRepository.save.mockResolvedValue(updatedBank);
            
            const result = await service.updateBank(id, body);
            
            expect(bankRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(Object.assign).toHaveBeenCalledWith(existingBank, body);
            expect(bankRepository.save).toHaveBeenCalledWith(updatedBank);
            expect(result).toEqual(updatedBank);
        });

        it('should return null when bank not found', async () => {
            const id = '1';
            const body = { name: 'Updated Bank' };
            mockBankRepository.findOne.mockResolvedValue(null);
            
            const result = await service.updateBank(id, body);
            
            expect(bankRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(bankRepository.save).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('deleteBank', () => {
        it('should call bankRepository.delete and return true when affected', async () => {
            const id = '1';
            mockBankRepository.delete.mockResolvedValue({ affected: 1 });
            
            const result = await service.deleteBank(id);
            
            expect(bankRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });

        it('should return false when not affected', async () => {
            const id = '1';
            mockBankRepository.delete.mockResolvedValue({ affected: 0 });
            
            const result = await service.deleteBank(id);
            
            expect(bankRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(false);
        });
    });
});