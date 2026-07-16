export class StatisticsResponseDto {
    readonly totalAmount: number;
    readonly totalInterest: number;
    readonly nearestDepositClosingInfo: NearestDepositClosingInfo;

    private constructor(
        totalAmount: number,
        totalInterest: number,
        nearestDepositClosingInfo: NearestDepositClosingInfo
    ) {
        this.totalAmount = totalAmount;
        this.totalInterest = totalInterest;
        this.nearestDepositClosingInfo = nearestDepositClosingInfo;
    }

    static create(
        totalAmount: number,
        totalInterest: number,
        nearestDepositClosingInfo: NearestDepositClosingInfo
    ): StatisticsResponseDto {
        return new StatisticsResponseDto(totalAmount, totalInterest, nearestDepositClosingInfo);
    }
}

export interface NearestDepositClosingInfo {
    readonly id: number;
    readonly bankName: string;
    readonly closeDate: Date;
}
