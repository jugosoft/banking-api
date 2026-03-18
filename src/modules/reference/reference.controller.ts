import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param
} from '@nestjs/common';

import { DepositType, Bank } from '@entities';
import { ReferenceService } from './services/reference.service';

@Controller('reference')
export class ReferenceController {
    constructor(private readonly referenceService: ReferenceService) { }

    // CRUD для deposit_type
    @Get('deposit-type')
    public async getDepositTypes(): Promise<DepositType[]> {
        return await this.referenceService.getDepositTypes();
    }

    @Get('deposit-type/:id')
    public async getDepositType(
        @Param('id') id: string
    ): Promise<DepositType | null> {
        return await this.referenceService.getDepositType(id);
    }

    @Post('deposit-type')
    public async createDepositType(
        @Body() body: { type: string; name: string }
    ): Promise<DepositType> {
        return await this.referenceService.createDepositType(body);
    }

    @Put('deposit-type/:id')
    public async updateDepositType(
        @Param('id') id: string,
        @Body() body: { type?: string; name?: string }
    ): Promise<DepositType | null> {
        return await this.referenceService.updateDepositType(id, body);
    }

    @Delete('deposit-type/:id')
    public async deleteDepositType(@Param('id') id: string): Promise<boolean> {
        return await this.referenceService.deleteDepositType(id);
    }

    // CRUD для bank
    @Get('bank')
    public async getBanks(): Promise<Bank[]> {
        return await this.referenceService.getBanks();
    }

    @Get('bank/:id')
    public async getBank(@Param('id') id: string): Promise<Bank | null> {
        return await this.referenceService.getBank(id);
    }

    @Post('bank')
    public async createBank(
        @Body() body: { name: string; shortName: string }
    ): Promise<Bank> {
        return await this.referenceService.createBank(body);
    }

    @Put('bank/:id')
    public async updateBank(
        @Param('id') id: string,
        @Body() body: { name?: string; shortName?: string }
    ): Promise<Bank | null> {
        return await this.referenceService.updateBank(id, body);
    }

    @Delete('bank/:id')
    public async deleteBank(@Param('id') id: string): Promise<boolean> {
        return await this.referenceService.deleteBank(id);
    }
}
