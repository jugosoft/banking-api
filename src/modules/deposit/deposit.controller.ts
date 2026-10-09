import { Body, Controller, Get, Post, Param, UseGuards, Query, HttpStatus, HttpException, Delete, HttpCode } from '@nestjs/common';
import { DepositService } from './services/deposit.service';
import { AtGuard } from '@common/guards';
import { IApiResponse, IPaginatedResponse } from '@common/types';
import { DepositEntity } from 'src/entities/deposit.entity';
import { DepositResponseDto } from './dto/deposit-response.dto';
import { ISaveDepositDto } from './dto/deposit.dto';
import { DepositListItemResponseDto } from './dto/deposit-list-response.dto';
import { GetDepositListQueryDto } from './dto/get-deposit-list-query.dto';
import { IDepositFilter } from './models/deposit-filter.model';
import { IPaging } from './models/paging.model';
import { SortOrder } from './models/sort-order.model';
import { GetCurrentUserId } from '@common/decorators';
import { UserResponseDto } from '@modules/users/dto/user-response.dto';

@Controller('deposit')
export class DepositController {

    public constructor(private readonly depositService: DepositService) { }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('list')
    public async getDepositList(
        @Query() query: GetDepositListQueryDto,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<IPaginatedResponse<DepositListItemResponseDto>>> {
        const page = query.page ?? 0;
        const size = query.size ?? 20;

        // Получаем текущего пользователя и его группу
        const currentUser = await this.depositService.getCurrentUserWithGroup(userId);

        let filter: IDepositFilter = {
            userId,
            bankId: query.bankId,
            includeHistory: query.actual,
        };

        // Если пользователь в группе — загружаем вклады всех участников
        let groupOwnerDto: UserResponseDto | undefined;
        if (currentUser?.groupId) {
            const memberUserIds = await this.depositService.getGroupMemberUserIds(currentUser.groupId);
            filter = {
                userIds: memberUserIds,
                bankId: query.bankId,
                includeHistory: query.actual,
            };

            // Получаем владельца группы
            const groupOwner = await this.depositService.getGroupOwner(currentUser.groupId);
            if (groupOwner) {
                groupOwnerDto = UserResponseDto.fromEntity(groupOwner);
            }
        }

        const paging: IPaging = {
            page,
            limit: size,
        };

        const sort: SortOrder<DepositEntity> | undefined = query.sortField
            ? { [query.sortField]: query.sortDirection ?? 'desc' }
            : undefined;

        const deposits = await this.depositService.getDepositList(filter, paging, sort);
        const depositDtos = deposits.items.map(deposit =>
            DepositListItemResponseDto.fromEntity(deposit, groupOwnerDto)
        );
        return {
            success: true,
            data: {
                hasMore: false,
                items: depositDtos,
                page,
                size,
                total: deposits.total,
            },
        };
    }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('stats')
    public async getDepositStats(
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<{ totalAmount: number; totalInterest: number }>> {
        const { totalAmount, totalInterest } = await this.depositService.getDepositStats(userId);

        return {
            success: true,
            data: {
                totalAmount,
                totalInterest
            }
        }
    }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    public async getDeposit(
        @Param('id') id: number,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<DepositResponseDto>> {
        const deposit = await this.depositService.getDeposit(id, userId);

        // Получаем владельца группы, если пользователь в группе
        const currentUser = await this.depositService.getCurrentUserWithGroup(userId);
        let groupOwnerDto: UserResponseDto | undefined;

        if (currentUser?.groupId) {
            const groupOwner = await this.depositService.getGroupOwner(currentUser.groupId);
            if (groupOwner) {
                groupOwnerDto = UserResponseDto.fromEntity(groupOwner);
            }
        }

        const dto = DepositResponseDto.fromEntity(deposit, groupOwnerDto);
        return {
            success: true,
            data: dto
        }
    }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post('save')
    public async saveDeposit(
        @Body() deposit: ISaveDepositDto,
        @GetCurrentUserId() userId: number,
    ): Promise<IApiResponse<DepositResponseDto>> {
        try {
            const newDeposit = await this.depositService.saveDeposit(deposit, userId);
            const depositDto = DepositResponseDto.fromEntity(newDeposit);
            return {
                success: true,
                data: depositDto
            }
        } catch (error) {
            // Обработка ошибки сохранения депозита
            throw new HttpException({
                error: {
                    code: 'DEPOSIT_SAVE_ERROR',
                    message: error.message || 'Ошибка при сохранении депозита'
                }
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    public async deleteDeposit(
        @Param('id') id: number,
        @GetCurrentUserId() userId: number
    ): Promise<IApiResponse<number>> {
        try {
            const depositId = await this.depositService.deleteDeposit(id, userId);
            return {
                success: true,
                data: depositId
            };
        } catch (error) {
            throw new HttpException({
                error: {
                    code: 'DEPOSIT_DELETE_ERROR',
                    message: error.message || 'Ошибка при удалении депозита'
                }
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
