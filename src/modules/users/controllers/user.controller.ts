import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';

import { UserEntity } from '@entities';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';
import { UserService } from '../services/user/user.service';
import { GetCurrentUserId } from 'src/common';
import { AtGuard } from '@common/guards';
import { IApiResponse, IPaginatedResponse } from '@common/types';
import { UserResponseDto } from '../dto/user-response.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AtGuard)
    @Get('me')
    @HttpCode(HttpStatus.OK)
    public async getProfile(@GetCurrentUserId() userId: number): Promise<IApiResponse<UserResponseDto>> {
        const user = await this.userService.getOneUser(userId);
        const userDto = UserResponseDto.fromEntity(user);
        return {
            success: true,
            data: userDto
        };
    }

    @Get()
    async getAllUsers(): Promise<IApiResponse<IPaginatedResponse<UserResponseDto>>> {
        const users = await this.userService.getAllUsers();
        const userDtos = users.map(user => UserResponseDto.fromEntity(user));
        const paginatedResponse: IPaginatedResponse<UserResponseDto> = {
            items: userDtos,
            total: userDtos.length,
            page: 1,
            size: userDtos.length,
            hasMore: false,
        };
        return {
            success: true,
            data: paginatedResponse
        };
    }

    @Get(':id')
    async getOneUser(@Param() params): Promise<IApiResponse<UserResponseDto>> {
        const user = await this.userService.getOneUser(params.id);
        const userDto = UserResponseDto.fromEntity(user);
        return {
            success: true,
            data: userDto
        };
    }

    @Post()
    async createUser(@Body() createUserInput: CreateUserInput): Promise<IApiResponse<UserResponseDto>> {
        const user = await this.userService.createUser(createUserInput);
        const userDto = UserResponseDto.fromEntity(user);
        return {
            success: true,
            data: userDto
        };
    }

    @Delete(':id')
    async removeOneUser(@Param() params): Promise<IApiResponse<number>> {
        const result = await this.userService.removeOneUser(params.id);
        return {
            success: true,
            data: result
        };
    }

    @Put()
    async updateUser(@Body() updateUserInput: UpdateUserInput): Promise<IApiResponse<UserResponseDto>> {
        const user = await this.userService.updateUser(updateUserInput);
        const userDto = UserResponseDto.fromEntity(user);
        return {
            success: true,
            data: userDto
        };
    }
}
