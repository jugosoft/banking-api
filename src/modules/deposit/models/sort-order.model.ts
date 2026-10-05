import type { SortDirection } from '../models/sort-direction.model';

export interface ISortField<T = any> {
    field: keyof T | string;
    direction: SortDirection;
}

export type SortOrder<T = any> = Record<keyof T | string, SortDirection>;
