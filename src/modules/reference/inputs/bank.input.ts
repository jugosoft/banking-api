import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class BankInput {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    shortName: string;
}