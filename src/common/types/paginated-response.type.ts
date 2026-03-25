export interface IPaginatedResponse<T> {
    readonly items: T[];
    readonly total: number;
    readonly page: number;
    readonly size: number;
    readonly hasMore: boolean;
}