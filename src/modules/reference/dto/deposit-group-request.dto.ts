import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class DepositGroupInput {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}
