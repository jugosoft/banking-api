import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class DepositTypeInput {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    name: string;
}