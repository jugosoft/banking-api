import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceController } from './reference.controller';
import { ReferenceService } from './services/reference.service';
import { Bank, DepositType } from '@entities';

// Mock для ReferenceService
const mockReferenceService = {
    getDepositTypes: jest.fn(),
    getDepositType: jest.fn(),
    createDepositType: jest.fn(),
    updateDepositType: jest.fn(),
    deleteDepositType: jest.fn(),
    getBanks: jest.fn(),
    getBank: jest.fn(),
    createBank: jest.fn(),
    updateBank: jest.fn(),
    deleteBank: jest.fn()
};

describe('ReferenceController', () => {
    let controller: ReferenceController;
    let service: ReferenceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReferenceController],
            providers: [
                {
                    provide: ReferenceService,
                    useValue: mockReferenceService
                }
            ]
        }).compile();

        controller = module.get<ReferenceController>(ReferenceController);
        service = module.get<ReferenceService>(ReferenceService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getDepositTypes', () => {
        it('should call referenceService.getDepositTypes', async () => {
            const mockTypes = [{ id: 1, name: 'Type1' }];
            mockReferenceService.getDepositTypes.mockResolvedValue(mockTypes);
            
            const result = await controller.getDepositTypes();
            
            expect(service.getDepositTypes).toHaveBeenCalled();
            expect(result).toEqual(mockTypes);
        });
    });

    describe('getDepositType', () => {
        it('should call referenceService.getDepositType with id', async () => {
            const id = '1';
            const mockType = { id: 1, name: 'Type1' };
            mockReferenceService.getDepositType.mockResolvedValue(mockType);
            
            const result = await controller.getDepositType(id);
            
            expect(service.getDepositType).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockType);
        });
    });

    describe('createDepositType', () => {
        it('should call referenceService.createDepositType with body', async () => {
            const body = { type: 'test', name: 'Test Type' };
            const mockType = { id: 1, ...body };
            mockReferenceService.createDepositType.mockResolvedValue(mockType);
            
            const result = await controller.createDepositType(body);
            
            expect(service.createDepositType).toHaveBeenCalledWith(body);
            expect(result).toEqual(mockType);
        });
    });

    describe('updateDepositType', () => {
        it('should call referenceService.updateDepositType with id and body', async () => {
            const id = '1';
            const body = { name: 'Updated Type' };
            const mockType = { id: 1, name: 'Updated Type' };
            mockReferenceService.updateDepositType.mockResolvedValue(mockType);
            
            const result = await controller.updateDepositType(id, body);
            
            expect(service.updateDepositType).toHaveBeenCalledWith(id, body);
            expect(result).toEqual(mockType);
        });
    });

    describe('deleteDepositType', () => {
        it('should call referenceService.deleteDepositType with id', async () => {
            const id = '1';
            mockReferenceService.deleteDepositType.mockResolvedValue(true);
            
            const result = await controller.deleteDepositType(id);
            
            expect(service.deleteDepositType).toHaveBeenCalledWith(id);
            expect(result).toBe(true);
        });
    });

    describe('getBanks', () => {
        it('should call referenceService.getBanks', async () => {
            const mockBanks = [{ id: 1, name: 'Bank1', shortName: 'B1' }];
            mockReferenceService.getBanks.mockResolvedValue(mockBanks);
            
            const result = await controller.getBanks();
            
            expect(service.getBanks).toHaveBeenCalled();
            expect(result).toEqual(mockBanks);
        });
    });

    describe('getBank', () => {
        it('should call referenceService.getBank with id', async () => {
            const id = '1';
            const mockBank = { id: 1, name: 'Bank1', shortName: 'B1' };
            mockReferenceService.getBank.mockResolvedValue(mockBank);
            
            const result = await controller.getBank(id);
            
            expect(service.getBank).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockBank);
        });
    });

    describe('createBank', () => {
        it('should call referenceService.createBank with body', async () => {
            const body = { name: 'New Bank', shortName: 'NB' };
            const mockBank = { id: 1, ...body };
            mockReferenceService.createBank.mockResolvedValue(mockBank);
            
            const result = await controller.createBank(body);
            
            expect(service.createBank).toHaveBeenCalledWith(body);
            expect(result).toEqual(mockBank);
        });
    });

    describe('updateBank', () => {
        it('should call referenceService.updateBank with id and body', async () => {
            const id = '1';
            const body = { name: 'Updated Bank' };
            const mockBank = { id: 1, name: 'Updated Bank', shortName: 'B1' };
            mockReferenceService.updateBank.mockResolvedValue(mockBank);
            
            const result = await controller.updateBank(id, body);
            
            expect(service.updateBank).toHaveBeenCalledWith(id, body);
            expect(result).toEqual(mockBank);
        });
    });

    describe('deleteBank', () => {
        it('should call referenceService.deleteBank with id', async () => {
            const id = '1';
            mockReferenceService.deleteBank.mockResolvedValue(true);
            
            const result = await controller.deleteBank(id);
            
            expect(service.deleteBank).toHaveBeenCalledWith(id);
            expect(result).toBe(true);
        });
    });
});