import { IsOptional, IsBoolean, IsNumber, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

const SORTABLE_FIELDS = ['amount', 'percent', 'startDate', 'endDate', 'name'] as const;
type SortableField = typeof SORTABLE_FIELDS[number];

export class GetDepositListQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    bankId?: number;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    actual?: boolean;

    @IsOptional()
    @IsIn(SORTABLE_FIELDS)
    @IsString()
    sortField?: SortableField;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortDirection?: 'asc' | 'desc';
}
