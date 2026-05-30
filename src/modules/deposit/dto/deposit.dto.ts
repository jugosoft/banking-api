// src/modules/deposit/inputs/deposit.input.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export interface ISaveDepositDto {
    deposit: DepositInput;
}

class DepositInput {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    percent: number; // или @IsOptional(), если может быть 0

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
}