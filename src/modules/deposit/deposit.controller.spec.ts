import { Test, TestingModule } from '@nestjs/testing';
import { DepositController } from './deposit.controller';
import { DepositService } from './services/deposit.service';
import { Deposit } from '@entities';

// Mock для DepositService
const mockDepositService = {
    getDepositList: jest.fn(),
    getDeposit: jest.fn(),
    saveDeposit: jest.fn()
};

describe('DepositController', () => {
    let controller: DepositController;
    let service: DepositService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DepositController],
            providers: [
                {
                    provide: DepositService,
                    useValue: mockDepositService
                }
            ]
        }).compile();

        controller = module.get<DepositController>(DepositController);
        service = module.get<DepositService>(DepositService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getDepositList', () => {
        it('should call depositService.getDepositList', async () => {
            const mockResponse = { deposits: [] };
            mockDepositService.getDepositList.mockResolvedValue(mockResponse);
            
            const result = await controller.getDepositList();
            
            expect(service.getDepositList).toHaveBeenCalled();
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getDeposit', () => {
        it('should call depositService.getDeposit with id', async () => {
            const id = '1';
            const mockResponse = { deposit: { id: 1 } };
            mockDepositService.getDeposit.mockResolvedValue(mockResponse);
            
            const result = await controller.getDeposit(id);
            
            expect(service.getDeposit).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('saveDeposit', () => {
        it('should call depositService.saveDeposit with deposit', async () => {
            const deposit = { id: 1, amount: 1000 };
            mockDepositService.saveDeposit.mockResolvedValue(true);
            
            const result = await controller.saveDeposit(deposit);
            
            expect(service.saveDeposit).toHaveBeenCalledWith(deposit);
            expect(result).toBe(true);
        });
    });
});