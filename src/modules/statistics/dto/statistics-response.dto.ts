export class StatisticsResponseDto {
    readonly totalAmount: number;
    readonly totalInterest: number;
    readonly currentIncome: number;
    readonly nearestDepositClosingInfo: NearestDepositClosingInfo;

    private constructor(
        totalAmount: number,
        totalInterest: number,
        currentIncome: number,
        nearestDepositClosingInfo: NearestDepositClosingInfo
    ) {
        this.totalAmount = totalAmount;
        this.totalInterest = totalInterest;
        this.currentIncome = currentIncome;
        this.nearestDepositClosingInfo = nearestDepositClosingInfo;
    }

    static create(
        totalAmount: number,
        totalInterest: number,
        currentIncome: number,
        nearestDepositClosingInfo: NearestDepositClosingInfo
    ): StatisticsResponseDto {
        return new StatisticsResponseDto(totalAmount, totalInterest, currentIncome, nearestDepositClosingInfo);
    }
}

export interface NearestDepositClosingInfo {
    readonly id: number;
    readonly bankName: string;
    readonly closeDate: Date;
}
