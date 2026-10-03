// src/modules/invest/dto/invest.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export interface ISaveInvestDto {
    invest: InvestInput;
}

class InvestInput {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsOptional()
    @IsBoolean()
    archived?: boolean;

    @IsNotEmpty()
    @IsNumber()
    bankId: number;

    @IsNotEmpty()
    @IsNumber()
    depositTypeId: number;

    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsOptional()
    @IsString()
    snapshotDate?: string;
}
