import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param
} from '@nestjs/common';

import { DepositTypeEntity, BankEntity, DepositGroupEntity } from '@entities';
import { ReferenceService } from './services/reference.service';
import { IApiResponse } from '@common/types/api-response.type';
import { IPaginatedResponse } from '@common/types/paginated-response.type';
import { BankResponseDto } from './dto/bank-response.dto';
import { DepositTypeResponseDto } from './dto/deposit-type-response.dto';
import { DepositGroupResponseDto } from './dto/deposit-group-response.dto';
import { ICreateDepositGroupDto } from './dto/create-deposit-group.dto';
import { DepositTypeRequestDto } from './dto';

@Controller('reference')
export class ReferenceController {
    constructor(private readonly referenceService: ReferenceService) { }

    // CRUD для deposit_type
    @Get('deposit-type/list')
    public async getDepositTypes(): Promise<IApiResponse<IPaginatedResponse<DepositTypeResponseDto>>> {
        const depositTypes = await this.referenceService.getDepositTypes();
        const depositTypeDtos = depositTypes.map(DepositTypeResponseDto.fromEntity);
        const paginatedResponse: IPaginatedResponse<DepositTypeResponseDto> = {
            items: depositTypeDtos,
            total: depositTypes.length,
            page: 1,
            size: depositTypes.length,
            hasMore: false,
        };
        return {
            success: true,
            data: paginatedResponse
        };
    }

    @Get('deposit-type/:id')
    public async getDepositType(
        @Param('id') id: string
    ): Promise<IApiResponse<DepositTypeResponseDto>> {
        const depsoitType = await this.referenceService.getDepositType(+id);
        return {
            success: true,
            data: DepositTypeResponseDto.fromEntity(depsoitType)
        };
    }

    @Post('deposit-type')
    public async saveDepositType(
        @Body() body: DepositTypeRequestDto
    ): Promise<IApiResponse<DepositTypeResponseDto>> {
        const depositType = await this.referenceService.createDepositType(
            body.name,
            body.depositGroupId,
            body.id
        );
        return {
            success: true,
            data: DepositTypeResponseDto.fromEntity(depositType)
        }
    }

    @Put('deposit-type/:id')
    public async updateDepositType(
        @Param('id') id: string,
        @Body() body: { type?: string; name?: string }
    ): Promise<DepositTypeEntity | null> {
        return await this.referenceService.updateDepositType(id, body);
    }

    @Delete('deposit-type/:id')
    public async deleteDepositType(@Param('id') id: string): Promise<IApiResponse<boolean>> {
        await this.referenceService.deleteDepositType(id);
        return {
            success: true
        }
    }

    // CRUD для bank
    @Get('bank/list')
    public async getBanks(): Promise<IApiResponse<IPaginatedResponse<BankResponseDto>>> {
        const banks = await this.referenceService.getBanks();
        const bankDtos = banks.map(BankResponseDto.fromEntity);
        const paginatedResponse: IPaginatedResponse<BankResponseDto> = {
            items: bankDtos,
            total: bankDtos.length,
            page: 1,
            size: bankDtos.length,
            hasMore: false,
        };
        return {
            success: true,
            data: paginatedResponse
        };
    }

    @Get('bank/:id')
    public async getBank(@Param('id') id: string): Promise<BankEntity | null> {
        return await this.referenceService.getBank(id);
    }

    @Post('bank')
    public async createBank(
        @Body() body: { name: string; shortName: string }
    ): Promise<BankEntity> {
        return await this.referenceService.createBank(body);
    }

    @Delete('bank/:id')
    public async deleteBank(@Param('id') id: string): Promise<IApiResponse<boolean>> {
        await this.referenceService.deleteBank(id);
        return {
            success: true,
        };
    }

    // CRUD для deposit_group
    @Get('deposit-group/list')
    public async getDepositGroups(): Promise<IApiResponse<IPaginatedResponse<DepositGroupResponseDto>>> {
        const depositGroups = await this.referenceService.getDepositGroups();
        const depositGroupDtos = depositGroups.map(DepositGroupResponseDto.fromEntity);
        const paginatedResponse: IPaginatedResponse<DepositGroupResponseDto> = {
            items: depositGroupDtos,
            total: depositGroups.length,
            page: 1,
            size: depositGroups.length,
            hasMore: false,
        };
        return {
            success: true,
            data: paginatedResponse
        };
    }

    @Get('deposit-group/:id')
    public async getDepositGroup(
        @Param('id') id: string
    ): Promise<IApiResponse<DepositGroupResponseDto>> {
        const depositGroup = await this.referenceService.getDepositGroup(id);
        return {
            success: true,
            data: DepositGroupResponseDto.fromEntity(depositGroup)
        };
    }

    @Post('deposit-group')
    public async createDepositGroup(
        @Body() body: ICreateDepositGroupDto
    ): Promise<IApiResponse<DepositGroupResponseDto>> {
        const depositGroup = await this.referenceService.createDepositGroup(body);
        return {
            success: true,
            data: DepositGroupResponseDto.fromEntity(depositGroup),
        }
    }

    @Delete('deposit-group/:id')
    public async deleteDepositGroup(@Param('id') id: string): Promise<IApiResponse<boolean>> {
        await this.referenceService.deleteDepositGroup(id);
        return {
            success: true,
        }
    }
}
