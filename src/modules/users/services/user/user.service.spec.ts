import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '@entities';
import { CreateUserInput } from '../../inputs/create-user.input';
import { UpdateUserInput } from '../../inputs/update-user.input';
import { UpdateUserRtInput } from '../../inputs/update-user-rt.input';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErrorCode } from '@constants';

// Mock для Repository
const mockUserRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    update: jest.fn()
};

describe('UserService', () => {
    let service: UserService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: mockUserRepository
                }
            ]
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createUser', () => {
        it('should call userRepository.save with createUserInput', async () => {
            const createUserInput: CreateUserInput = { name: 'New User', email: 'new@example.com' };
            const savedUser = { id: 1, ...createUserInput };
            mockUserRepository.save.mockResolvedValue(savedUser);

            const result = await service.createUser(createUserInput);

            expect(userRepository.save).toHaveBeenCalledWith(createUserInput);
            expect(result).toEqual(savedUser);
        });
    });

    describe('getOneUser', () => {
        it('should call userRepository.findOne with id and return user', async () => {
            const userId = 1;
            const mockUser = { id: userId, name: 'Test User' };
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.getOneUser(userId);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
            expect(result).toEqual(mockUser);
        });

        it('should throw error when user not found', async () => {
            const userId = 1;
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.getOneUser(userId)).rejects.toThrow(ErrorCode.NO_USER);
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
        });
    });

    describe('getOneUserByEmail', () => {
        it('should call userRepository.findOne with email', async () => {
            const email = 'test@example.com';
            const mockUser = { id: 1, email, name: 'Test User' };
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.getOneUserByEmail(email);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(result).toEqual(mockUser);
        });
    });

    describe('getOneUserByName', () => {
        it('should call userRepository.findOne with name', async () => {
            const name = 'Test User';
            const mockUser = { id: 1, name, email: 'test@example.com' };
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.getOneUserByName(name);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { name } });
            expect(result).toEqual(mockUser);
        });
    });

    describe('getAllUsers', () => {
        it('should call userRepository.find', async () => {
            const mockUsers = [{ id: 1, name: 'User1' }];
            mockUserRepository.find.mockResolvedValue(mockUsers);

            const result = await service.getAllUsers();

            expect(userRepository.find).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });
    });

    describe('removeOneUser', () => {
        it('should call userRepository.delete and return id when affected', async () => {
            const userId = 1;
            mockUserRepository.delete.mockResolvedValue({ affected: 1 });

            const result = await service.removeOneUser(userId);

            expect(userRepository.delete).toHaveBeenCalledWith({ id: userId });
            expect(result).toEqual(userId);
        });

        it('should return null when delete not affected', async () => {
            const userId = 1;
            mockUserRepository.delete.mockResolvedValue({ affected: 0 });

            const result = await service.removeOneUser(userId);

            expect(userRepository.delete).toHaveBeenCalledWith({ id: userId });
            expect(result).toBeNull();
        });
    });

    describe('updateUser', () => {
        it('should call userRepository.update and getOneUser', async () => {
            const updateUserInput: UpdateUserInput = { id: 1, name: 'Updated User' };
            const updatedUser = { id: 1, name: 'Updated User' };

            mockUserRepository.update.mockResolvedValue(undefined);
            jest.spyOn(service, 'getOneUser').mockResolvedValue(updatedUser);

            const result = await service.updateUser(updateUserInput);

            expect(userRepository.update).toHaveBeenCalledWith({ id: updateUserInput.id }, updateUserInput);
            expect(service.getOneUser).toHaveBeenCalledWith(updateUserInput.id);
            expect(result).toEqual(updatedUser);
        });
    });

    describe('updateUserRt', () => {
        it('should call userRepository.update and getOneUser', async () => {
            const updateUserRtInput: UpdateUserRtInput = { id: 1, refreshToken: 'new_rt' };
            const updatedUser = { id: 1, refreshToken: 'new_rt' };

            mockUserRepository.update.mockResolvedValue(undefined);
            jest.spyOn(service, 'getOneUser').mockResolvedValue(updatedUser);

            const result = await service.updateUserRt(updateUserRtInput);

            expect(userRepository.update).toHaveBeenCalledWith({ id: updateUserRtInput.id }, updateUserRtInput);
            expect(service.getOneUser).toHaveBeenCalledWith(updateUserRtInput.id);
            expect(result).toEqual(updatedUser);
        });
    });
});