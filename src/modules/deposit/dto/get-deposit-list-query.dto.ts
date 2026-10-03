import { IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDepositListQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    bankId?: number;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    actual?: boolean;
}
