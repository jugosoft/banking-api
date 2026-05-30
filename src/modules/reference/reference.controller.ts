import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param
} from '@nestjs/common';

import { DepositTypeEntity, BankEntity } from '@entities';
import { ReferenceService } from './services/reference.service';
import { IApiResponse } from '@common/types/api-response.type';
import { IPaginatedResponse } from '@common/types/paginated-response.type';
import { BankResponseDto } from './dto/bank-response.dto';
import { DepositTypeResponseDto } from './dto/deposit-type-response.dto';

@Controller('reference')
export class ReferenceController {
    constructor(private readonly referenceService: ReferenceService) { }

    private createSuccessResponse<T>(data: T): IApiResponse<T> {
        return {
            success: true,
            data,
        };
    }

    // CRUD для deposit_type
    @Get('deposit-types')
    public async getDepositTypes(): Promise<IApiResponse<IPaginatedResponse<DepositTypeResponseDto>>> {
        const depositTypes = await this.referenceService.getDepositTypes();
        const depositTypeDtos = depositTypes.map(type => DepositTypeResponseDto.fromEntity(type));
        const paginatedResponse: IPaginatedResponse<DepositTypeResponseDto> = {
            items: depositTypeDtos,
            total: depositTypeDtos.length,
            page: 1,
            size: depositTypeDtos.length,
            hasMore: false,
        };
        return this.createSuccessResponse(paginatedResponse);
    }

    @Get('deposit-type/:id')
    public async getDepositType(
        @Param('id') id: string
    ): Promise<DepositTypeEntity | null> {
        return await this.referenceService.getDepositType(id);
    }

    @Post('deposit-type')
    public async createDepositType(
        @Body() body: { type: string; name: string }
    ): Promise<DepositTypeEntity> {
        return await this.referenceService.createDepositType(body);
    }

    @Put('deposit-type/:id')
    public async updateDepositType(
        @Param('id') id: string,
        @Body() body: { type?: string; name?: string }
    ): Promise<DepositTypeEntity | null> {
        return await this.referenceService.updateDepositType(id, body);
    }

    @Delete('deposit-type/:id')
    public async deleteDepositType(@Param('id') id: string): Promise<boolean> {
        return await this.referenceService.deleteDepositType(id);
    }

    // CRUD для bank
    @Get('banks')
    public async getBanks(): Promise<IApiResponse<IPaginatedResponse<BankResponseDto>>> {
        const banks = await this.referenceService.getBanks();
        const bankDtos = banks.map(bank => BankResponseDto.fromEntity(bank));
        const paginatedResponse: IPaginatedResponse<BankResponseDto> = {
            items: bankDtos,
            total: bankDtos.length,
            page: 1,
            size: bankDtos.length,
            hasMore: false,
        };
        return this.createSuccessResponse(paginatedResponse);
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

    @Put('bank/:id')
    public async updateBank(
        @Param('id') id: string,
        @Body() body: { name?: string; shortName?: string }
    ): Promise<BankEntity | null> {
        return await this.referenceService.updateBank(id, body);
    }

    @Delete('bank/:id')
    public async deleteBank(@Param('id') id: string): Promise<boolean> {
        return await this.referenceService.deleteBank(id);
    }
}
