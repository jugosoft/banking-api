import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user/user.service';
import { UserEntity } from '@entities';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';

// Mock для UserService
const mockUserService = {
    getOneUser: jest.fn(),
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    removeOneUser: jest.fn(),
    updateUser: jest.fn()
};

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService
                }
            ]
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getProfile', () => {
        it('should call userService.getOneUser with userId from decorator', async () => {
            const userId = 123;
            const mockUser = { id: userId, name: 'Test User' };
            mockUserService.getOneUser.mockResolvedValue(mockUser);
            
            const result = await controller.getProfile(userId);
            
            expect(service.getOneUser).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockUser);
        });
    });

    describe('getAllUsers', () => {
        it('should call userService.getAllUsers', async () => {
            const mockUsers = [{ id: 1, name: 'User1' }];
            mockUserService.getAllUsers.mockResolvedValue(mockUsers);
            
            const result = await controller.getAllUsers();
            
            expect(service.getAllUsers).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });
    });

    describe('getOneUser', () => {
        it('should call userService.getOneUser with param id', async () => {
            const params = { id: '1' };
            const mockUser = { id: 1, name: 'Test User' };
            mockUserService.getOneUser.mockResolvedValue(mockUser);
            
            const result = await controller.getOneUser(params);
            
            expect(service.getOneUser).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockUser);
        });
    });

    describe('createUser', () => {
        it('should call userService.createUser with createUserInput', async () => {
            const createUserInput: CreateUserInput = { name: 'New User', email: 'new@example.com' };
            const mockUser = { id: 1, ...createUserInput };
            mockUserService.createUser.mockResolvedValue(mockUser);
            
            const result = await controller.createUser(createUserInput);
            
            expect(service.createUser).toHaveBeenCalledWith(createUserInput);
            expect(result).toEqual(mockUser);
        });
    });

    describe('removeOneUser', () => {
        it('should call userService.removeOneUser with param id', async () => {
            const params = { id: '1' };
            mockUserService.removeOneUser.mockResolvedValue(1);
            
            const result = await controller.removeOneUser(params);
            
            expect(service.removeOneUser).toHaveBeenCalledWith(1);
            expect(result).toEqual(1);
        });
    });

    describe('updateUser', () => {
        it('should call userService.updateUser with updateUserInput', async () => {
            const updateUserInput: UpdateUserInput = { id: 1, name: 'Updated User' };
            const mockUser = { id: 1, name: 'Updated User' };
            mockUserService.updateUser.mockResolvedValue(mockUser);
            
            const result = await controller.updateUser(updateUserInput);
            
            expect(service.updateUser).toHaveBeenCalledWith(updateUserInput);
            expect(result).toEqual(mockUser);
        });
    });
});